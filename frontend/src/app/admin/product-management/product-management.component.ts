import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService, Product } from '../admin.service';
import { EditProductDialogComponent } from './edit-product-dialog.component';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h2>Product Management</h2>
        <button mat-raised-button color="primary" (click)="openAddProductDialog()">
          <mat-icon>add</mat-icon>
          Add Product
        </button>
      </div>
      
      <table mat-table [dataSource]="products" class="mat-elevation-z8">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let product">{{product.name}}</td>
        </ng-container>

        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef>Description</th>
          <td mat-cell *matCellDef="let product">{{product.description}}</td>
        </ng-container>

        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef>Price</th>
          <td mat-cell *matCellDef="let product">₮{{product.price | number:'1.0-0'}}</td>
        </ng-container>

        <ng-container matColumnDef="quantity">
          <th mat-header-cell *matHeaderCellDef>Quantity</th>
          <td mat-cell *matCellDef="let product">{{product.quantity}}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let product">
            <button mat-icon-button color="primary" (click)="editProduct(product)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteProduct(product)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
    }
  `]
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['name', 'description', 'price', 'quantity', 'actions'];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.adminService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.snackBar.open('Error loading products', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  openAddProductDialog() {
    const dialogRef = this.dialog.open(EditProductDialogComponent, {
      width: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.addProduct(result).subscribe({
          next: () => {
            this.loadProducts();
            this.snackBar.open('Product added successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom'
            });
          },
          error: (error) => {
            console.error('Error adding product:', error);
            this.snackBar.open('Error adding product', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom'
            });
          }
        });
      }
    });
  }

  editProduct(product: Product) {
    const dialogRef = this.dialog.open(EditProductDialogComponent, {
      width: '500px',
      data: { mode: 'edit', product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.updateProduct(product.id, result).subscribe({
          next: () => {
            this.loadProducts();
            this.snackBar.open('Product updated successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom'
            });
          },
          error: (error) => {
            console.error('Error updating product:', error);
            this.snackBar.open('Error updating product', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom'
            });
          }
        });
      }
    });
  }

  deleteProduct(product: Product) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.deleteProduct(product.id).subscribe({
        next: () => {
          this.loadProducts();
          this.snackBar.open('Product deleted successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.snackBar.open('Error deleting product', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        }
      });
    }
  }
}