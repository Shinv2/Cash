import { Component, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>Add New User</h2>
    <mat-dialog-content>
      <form #userForm="ngForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Username</mat-label>
          <input matInput [(ngModel)]="user.username" name="username" required #firstInput>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput [(ngModel)]="user.email" name="email" required type="email">
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput [(ngModel)]="user.password" name="password" required type="password">
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Role</mat-label>
          <mat-select [(ngModel)]="user.role" name="role" required>
            <mat-option value="user">Merchant</mat-option>
            <mat-option value="admin">Admin</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="undefined" cdkFocusInitial>Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!userForm.form.valid">
        Add User
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
  `]
})
export class AddUserDialogComponent implements OnDestroy {
  user = {
    username: '',
    email: '',
    password: '',
    role: 'user'
  };

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    private focusMonitor: FocusMonitor,
    private elementRef: ElementRef
  ) {
    this.dialogRef.disableClose = true;
    this.focusMonitor.monitor(this.elementRef.nativeElement, true);
  }

  ngOnDestroy() {
    this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
  }

  onSubmit() {
    if (this.user.username && this.user.email && this.user.password && this.user.role) {
      this.dialogRef.close(this.user);
    }
  }
}
