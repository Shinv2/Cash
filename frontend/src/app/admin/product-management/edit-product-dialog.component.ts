import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface DialogData {
  mode: 'add' | 'edit';
  product?: {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    quantity: number;
  };
}

@Component({
  selector: 'app-edit-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{data.mode === 'add' ? 'Add Product' : 'Edit Product'}}</h2>
    <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field appearance="fill">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" required>
          <mat-error *ngIf="productForm.get('name')?.hasError('required')">
            Name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" required rows="3"></textarea>
          <mat-error *ngIf="productForm.get('description')?.hasError('required')">
            Description is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Price</mat-label>
          <input matInput type="number" formControlName="price" required min="0" step="0.01">
          <mat-error *ngIf="productForm.get('price')?.hasError('required')">
            Price is required
          </mat-error>
          <mat-error *ngIf="productForm.get('price')?.hasError('min')">
            Price must be greater than 0
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" formControlName="quantity" required min="0">
          <mat-error *ngIf="productForm.get('quantity')?.hasError('required')">
            Quantity is required
          </mat-error>
          <mat-error *ngIf="productForm.get('quantity')?.hasError('min')">
            Quantity must be greater than or equal to 0
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Image URL</mat-label>
          <input matInput formControlName="imageUrl">
        </mat-form-field>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!productForm.valid">
          {{data.mode === 'add' ? 'Add Product' : 'Save Changes'}}
        </button>
      </div>
    </form>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 1rem;
    }
    .mat-mdc-dialog-actions {
      padding: 1rem;
    }
  `]
})
export class EditProductDialogComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.productForm = this.fb.group({
      name: [data.product?.name || '', Validators.required],
      description: [data.product?.description || '', Validators.required],
      price: [data.product?.price || '', [Validators.required, Validators.min(0)]],
      quantity: [data.product?.quantity || '', [Validators.required, Validators.min(0)]],
      imageUrl: [data.product?.imageUrl || '']
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}