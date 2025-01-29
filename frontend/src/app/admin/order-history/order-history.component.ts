import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
    MatSortModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [DatePipe],
  template: `
    <div class="container">
      <div class="header">
        <h2>Order History</h2>
        <div class="search-box">
          <mat-form-field appearance="outline">
            <mat-label>Search by username</mat-label>
            <input matInput [(ngModel)]="searchUsername" (keyup.enter)="searchOrders()" placeholder="Enter username">
            <button *ngIf="searchUsername" matSuffix mat-icon-button aria-label="Clear" (click)="showAllOrders()">
              <mat-icon>close</mat-icon>
            </button>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="searchOrders()">
            <mat-icon>search</mat-icon>
            Search
          </button>
        </div>
      </div>
      
      <table mat-table [dataSource]="displayedOrders" matSort class="mat-elevation-z8">
        <ng-container matColumnDef="created_at">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
          <td mat-cell *matCellDef="let item">{{formatDate(item.createdAt)}}</td>
        </ng-container>

        <ng-container matColumnDef="username">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Merchant</th>
          <td mat-cell *matCellDef="let item">{{item.username}}</td>
        </ng-container>

        <ng-container matColumnDef="product_name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Product</th>
          <td mat-cell *matCellDef="let item">{{item.product_name}}</td>
        </ng-container>

        <ng-container matColumnDef="quantity">
          <th mat-header-cell *matHeaderCellDef mat-sort-header class="text-center">Quantity</th>
          <td mat-cell *matCellDef="let item" class="text-center">{{item.quantity}}</td>
        </ng-container>

        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef mat-sort-header class="text-right">Unit Price</th>
          <td mat-cell *matCellDef="let item" class="text-right">₮{{item.price | number:'1.0-0'}}</td>
        </ng-container>

        <ng-container matColumnDef="total">
          <th mat-header-cell *matHeaderCellDef mat-sort-header class="text-right">Total Price</th>
          <td mat-cell *matCellDef="let item" class="text-right">₮{{item.price * item.quantity | number:'1.0-0'}}</td>
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
      height: calc(100vh - 64px);
      display: flex;
      flex-direction: column;
      overflow: auto;
      
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 16px;
      flex-shrink: 0;
    }
    
    h2 {
      margin: 0;
    }
    
    .search-box {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    mat-form-field {
      width: 250px;
      margin-bottom: -1.25em;
    }
    
    table {
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: none;
      border: 1px solid #ccc;
    }
    
    th {
      background-color: #f2f2f2;
      font-weight: bold;
      white-space: nowrap;
      padding: 0 16px !important;
      
      &.text-right {
        text-align: center;
      }
      
      &.text-center {
        text-align: center;
      }
    }
    
    // td {
    //   padding: 12px 16px !important;
      
    //   &.text-right {
    //     text-align: right;
    //     font-variant-numeric: tabular-nums;
    //   }
      
    //   &.text-center {
    //     text-align: center;
    //   }
    // }
    
    tr:hover {
      background-color: #f5f5f5;
    }
    
    mat-paginator {
      flex-shrink: 0;
      margin-top: 0;
      border-top: 1px solid #ccc;
      // border-radius: 8px;
      
    }
    
    button[mat-raised-button] {
      height: 40px;
    }
  `]
})
export class OrderHistoryComponent implements OnInit {
  orderItems: OrderItem[] = [];
  displayedOrders: OrderItem[] = [];
  displayedColumns: string[] = ['created_at', 'username', 'product_name', 'quantity', 'price', 'total'];
  searchUsername: string = '';

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
        this.orderItems = items.map((item: OrderItem) => ({
          ...item,
          created_at: this.formatDate(item.createdAt)
        }));
        this.displayedOrders = this.orderItems;
        this.table?.renderRows();
      },
      error: (error: any) => {
        console.error('Error loading order history:', error);
      }
    });
  }

  searchOrders() {
    if (!this.searchUsername.trim()) {
      this.showAllOrders();
      return;
    }
    
    const searchTerm = this.searchUsername.toLowerCase().trim();
    this.displayedOrders = this.orderItems.filter(item => 
      item.username.toLowerCase().includes(searchTerm)
    );
  }

  showAllOrders() {
    this.searchUsername = '';
    this.displayedOrders = this.orderItems;
  }

  formatDate(date: string): string {
    const localDate = new Date(date);
    return this.datePipe.transform(localDate, 'MMM d, y, h:mm:ss a') || date;
  }
}
