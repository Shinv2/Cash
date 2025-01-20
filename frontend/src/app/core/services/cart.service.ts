import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = environment.apiUrl + '/cart';
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartUpdated = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initial load of cart items
    this.loadCartItems();
  }

  private loadCartItems() {
    this.getCart().subscribe({
      next: (cart) => {
        if (cart && cart.items) {
          this.cartItems = cart.items;
          this.cartItemsSubject.next([...this.cartItems]);
        }
      },
      error: (error) => console.error('Error loading cart items:', error)
    });
  }

  getCartItemCount(): number {
    return this.cartItems.length;
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }

  getCartItems(): Observable<CartItem[]> {
    return this.getCart().pipe(
      map(cart => {
        if (cart && cart.items) {
          this.cartItems = cart.items;
          this.cartItemsSubject.next([...this.cartItems]);
          return cart.items;
        }
        return [];
      })
    );
  }

  getAllUserCarts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  addToCart(product: Product): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/add`, { productId: product.id, quantity: 1 })
      .pipe(
        tap((cart: Cart) => {
          if (cart && cart.items) {
            this.cartItems = cart.items;
            this.cartItemsSubject.next([...this.cartItems]);
          }
        })
      );
  }

  removeFromCart(productId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/remove/${productId}`)
      .pipe(
        tap((cart: Cart) => {
          // Remove the item locally first
          this.cartItems = this.cartItems.filter(item => item.product_id !== productId);
          this.cartItemsSubject.next([...this.cartItems]);
          
          // Then update with server response
          if (cart && cart.items) {
            this.cartItems = cart.items;
            this.cartItemsSubject.next([...this.cartItems]);
          }
        })
      );
  }

  updateQuantity(productId: number, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/update-quantity`, { productId, quantity })
      .pipe(
        tap((cart: Cart) => {
          if (cart && cart.items) {
            this.cartItems = cart.items;
            this.cartItemsSubject.next([...this.cartItems]);
          }
        })
      );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear`)
      .pipe(
        tap(() => {
          this.cartItems = [];
          this.cartItemsSubject.next([]);
        })
      );
  }

  checkout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, {}).pipe(
      tap(() => {
        // Clear local cart data after successful checkout
        this.cartItems = [];
        this.cartItemsSubject.next([]);
      })
    );
  }
}
