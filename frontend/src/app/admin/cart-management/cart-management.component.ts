import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="cart-management">
      <h3>User Order Management</h3>
      
      <table mat-table [dataSource]="userCarts" class="mat-elevation-z8">
        <!-- User Column -->
        <ng-container matColumnDef="user">
          <th mat-header-cell *matHeaderCellDef>User</th>
          <td mat-cell *matCellDef="let cart">{{cart.user.email}}</td>
        </ng-container>

        <!-- Items Count Column -->
        <ng-container matColumnDef="itemsCount">
          <th mat-header-cell *matHeaderCellDef>Items</th>
          <td mat-cell *matCellDef="let cart">{{cart.items.length}}</td>
        </ng-container>

        <!-- Total Column -->
        <ng-container matColumnDef="total">
          <th mat-header-cell *matHeaderCellDef>Total</th>
          <td mat-cell *matCellDef="let cart">\₮{{calculateTotal (cart.items) | number:'1.0-0'}}</td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let cart">
            <button mat-icon-button color="primary" (click)="viewCartDetails(cart)">
              <mat-icon>visibility</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .cart-management {
      padding: 20px;
    }

    h3 {
      margin-bottom: 20px;
    }

    table {
      width: 100%;
    }

    .mat-column-actions {
      width: 100px;
      text-align: center;
    }
  `]
})
export class CartManagementComponent implements OnInit {
  userCarts: any[] = [];
  displayedColumns: string[] = ['user', 'itemsCount', 'total', 'actions'];

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadUserCarts();
  }

  loadUserCarts() {
    this.cartService.getAllUserCarts().subscribe({
      next: (carts) => {
        this.userCarts = carts;
      },
      error: (error) => {
        console.error('Error loading user order:', error);
      }
    });
  }

  calculateTotal(items: any[]): number {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  viewCartDetails(cart: any) {
    console.log('View order details:', cart);
  }
}
