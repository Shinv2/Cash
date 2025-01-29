import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../core/services/cart.service';
import { CartItem } from '../core/models/cart.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    FormsModule

  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  selectedPaymentMethod: 'cash' | 'debit' | 'qris' = 'cash';
  isLoading = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
      },
      error: (error) => {
        console.error('Error loading order items:', error);
      }
    });
  }

  calculateTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  onPaymentMethodChange(method: 'cash' | 'debit' | 'qris') {
    this.selectedPaymentMethod = method;
  }

  processPayment() {
    this.isLoading = true;
    // Here you would integrate with your payment processing service
    this.cartService.checkout().subscribe({
      next: () => {
        this.isLoading = false;
        // Navigate to success page or show success message
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Payment failed:', error);
        // Show error message to user
      }
    });
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}
