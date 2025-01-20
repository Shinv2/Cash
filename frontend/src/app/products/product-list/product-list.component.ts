import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule
  ]
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  cartItemCount: number = 0;
  username: string = '';
  private cartSubscription: Subscription;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService,
    public router: Router
  ) {
    this.username = this.authService.getCurrentUser()?.username || '';
    this.cartSubscription = this.cartService.cartUpdated.subscribe(() => {
      this.updateCartCount();
    });
  }

  ngOnInit() {
    this.loadProducts();
    this.updateCartCount();
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  updateCartCount() {
    this.cartItemCount = this.cartService.getCartItemCount();
  }

  addToCart(product: Product) {
    if (this.authService.isAdmin()) return;  
    this.cartService.addToCart(product).subscribe({
      next: () => {
        // Cart update will be handled by the subscription
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
