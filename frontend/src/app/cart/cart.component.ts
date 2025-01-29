import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { CartService } from '../core/services/cart.service';
import { CartItem } from '../core/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  displayedColumns: string[] = ['image', 'name', 'unit_price', 'quantity', 'total', 'actions'];
  private cartSubscription: Subscription;
  isLoading = false;
  errorMessage = '';
  maxQuantity = 99;

  constructor(
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Subscribe to cart updates
    this.cartSubscription = this.cartService.cartUpdated.subscribe(items => {
      this.cartItems = [...items]; // Create a new array to ensure change detection
    });
  }

  ngOnInit() {
    this.loadCartItems();
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  loadCartItems() {
    this.isLoading = true;
    this.errorMessage = '';
    this.cartService.getCartItems()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (items) => {
          this.cartItems = [...items];
        },
        error: (error: Error) => {
          this.errorMessage = 'Failed to load order. Please try again.';
          this.showError('Error loading order');
        }
      });
  }

  removeFromCart(item: CartItem) {
    if (!item || !item.product_id) {
      return;
    }

    this.isLoading = true;
    // Optimistically remove the item locally
    this.cartItems = this.cartItems.filter(i => i.product_id !== item.product_id);

    this.cartService.removeFromCart(item.product_id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.showSuccess('Item removed from order');
        },
        error: (error: Error) => {
          // Revert the optimistic update on error
          this.loadCartItems();
          console.error('Error removing item:', error);
          this.showError('Error removing item from order');
        }
      });
  }

  updateItemQuantity(item: CartItem, newQuantity: number) {
    if (!item || !item.product_id) {
      this.showError('Invalid item');
      return;
    }

    if (newQuantity < 1 || newQuantity > this.maxQuantity) {
      this.showError(`Quantity must be between 1 and ${this.maxQuantity}`);
      return;
    }

    this.isLoading = true;
    // Store the old quantity for reverting if needed
    const oldQuantity = item.quantity;
    
    // Optimistically update the quantity
    item.quantity = newQuantity;
    item.price = item.product.price * newQuantity;

    this.cartService.updateQuantity(item.product_id, newQuantity)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.showSuccess('Quantity updated');
        },
        error: (error: unknown) => {
          // Revert the optimistic update on error
          item.quantity = oldQuantity;
          item.price = item.product.price * oldQuantity;
          console.error('Error updating quantity:', error);
          this.showError('Error updating quantity');
        }
      });
  }

  increaseQuantity(item: CartItem) {
    if (item.quantity >= this.maxQuantity) {
      this.showError(`Maximum quantity is ${this.maxQuantity}`);
      return;
    }
    this.updateItemQuantity(item, item.quantity + 1);
  }
  
  decreaseQuantity(item: CartItem) {
    if (item.quantity <= 1) {
      this.showError('Minimum quantity is 1');
      return;
    }
    this.updateItemQuantity(item, item.quantity - 1);
  }

  calculateTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }

  checkout() {
    if (this.cartItems.length === 0) {
      this.showError('Cart is empty');
      return;
    }

    this.router.navigate(['/checkout']);
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
    });
  }
}
