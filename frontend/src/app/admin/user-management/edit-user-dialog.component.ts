import { Component, Inject, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FocusMonitor } from '@angular/cdk/a11y';
import { User } from '../admin.service';

@Component({
  selector: 'app-edit-user-dialog',
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
    <h2 mat-dialog-title>Edit Merchant</h2>
    <mat-dialog-content>
      <form #userForm="ngForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Username</mat-label>
          <input matInput [(ngModel)]="editedUser.username" name="username" required #firstInput>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput [(ngModel)]="editedUser.email" name="email" required type="email">
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Role</mat-label>
          <mat-select [(ngModel)]="editedUser.role" name="role" required>
            <mat-option value="admin">Admin</mat-option>
            <mat-option value="merchant">Merchant</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="undefined" cdkFocusInitial>Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!userForm.form.valid">
        Save
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
export class EditUserDialogComponent implements OnDestroy {
  editedUser: User;

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private focusMonitor: FocusMonitor,
    private elementRef: ElementRef
  ) {
    this.editedUser = { ...data };
    this.dialogRef.disableClose = true;
    this.focusMonitor.monitor(this.elementRef.nativeElement, true);
  }

  ngOnDestroy() {
    this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
  }

  onSubmit() {
    if (this.editedUser.username && this.editedUser.email && this.editedUser.role) {
      this.dialogRef.close(this.editedUser);
    }
  }
}
