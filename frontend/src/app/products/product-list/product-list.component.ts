import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/product.model';
import { CartComponent } from '../../cart/cart.component';
import { Subscription } from 'rxjs';
import { CartItem } from '../../core/models/cart.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    CartComponent
  ]
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  cartItemCount: number = 0;
  private cartSubscription: Subscription;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService,
    private router: Router
  ) {
    // Subscribe to cart updates to track items
    this.cartSubscription = this.cartService.cartUpdated.subscribe((items: CartItem[]) => {
      this.cartItemCount = items.length;
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  addToCart(product: Product): void {
    if (this.authService.isAdmin()) return;  
    this.cartService.addToCart(product).subscribe({
      next: () => {
        // Cart update will be handled by the subscription
      },
      error: (error) => {
        console.error('Error adding to order:', error);
      }
    });
  }

  // Helper method to check if cart should be visible
  shouldShowCart(): boolean {
    return this.cartItemCount > 0 && 
           this.authService.isLoggedIn() && 
           !this.authService.isAdmin();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
