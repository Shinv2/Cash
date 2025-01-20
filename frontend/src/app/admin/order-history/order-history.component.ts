import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  createdAt: string;
  username: string;
  product_name: string;
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [DatePipe],
  template: `
    <div class="container">
      <h2>Order History</h2>
      
      <table mat-table [dataSource]="orderItems" matSort class="mat-elevation-z8">
        <ng-container matColumnDef="created_at">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
          <td mat-cell *matCellDef="let item">{{formatDate(item.createdAt)}}</td>
        </ng-container>

        <ng-container matColumnDef="username">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Customer</th>
          <td mat-cell *matCellDef="let item">{{item.username}}</td>
        </ng-container>

        <ng-container matColumnDef="product_name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Product</th>
          <td mat-cell *matCellDef="let item">{{item.product_name}}</td>
        </ng-container>

        <ng-container matColumnDef="quantity">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Quantity</th>
          <td mat-cell *matCellDef="let item">{{item.quantity}}</td>
        </ng-container>

        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Price</th>
          <td mat-cell *matCellDef="let item">₮{{item.price}}</td>
        </ng-container>

        <ng-container matColumnDef="total">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Total</th>
          <td mat-cell *matCellDef="let item">₮{{item.price * item.quantity}}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <mat-paginator [pageSizeOptions]="[5, 10, 20]"
                    showFirstLastButtons
                    aria-label="Select page">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    
    table {
      width: 100%;
    }
    
    .mat-column-price,
    .mat-column-total {
      text-align: right;
      padding-right: 24px;
    }
  `]
})
export class OrderHistoryComponent implements OnInit {
  orderItems: OrderItem[] = [];
  displayedColumns: string[] = ['created_at', 'username', 'product_name', 'quantity', 'price', 'total'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<OrderItem>;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.loadOrderHistory();
  }

  loadOrderHistory() {
    this.http.get<OrderItem[]>(`${environment.apiUrl}/cart/order-history`).subscribe({
      next: (items: OrderItem[]) => {
        // Convert UTC dates to local timezone and format
        this.orderItems = items.map((item: OrderItem) => ({
          ...item,
          created_at: this.formatDate(item.createdAt)
        }));
        this.table?.renderRows();
      },
      error: (error: any) => {
        console.error('Error loading order history:', error);
      }
    });
  }

  formatDate(date: string): string {
    // Convert UTC ISO string to local date and format
    const localDate = new Date(date);
    return this.datePipe.transform(localDate, 'MMM d, y, h:mm:ss a') || date;
  }
}
