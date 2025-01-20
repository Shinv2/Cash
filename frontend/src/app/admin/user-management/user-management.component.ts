import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService, User } from '../admin.service';
import { AddUserDialogComponent } from './add-user-dialog.component';
import { EditUserDialogComponent } from './edit-user-dialog.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h2>Merchant Management</h2>
        <button mat-raised-button color="primary" (click)="openAddUserDialog()">
          Add Merchant
        </button>
      </div>

      <table mat-table [dataSource]="users" class="mat-elevation-z8">
        <ng-container matColumnDef="username">
          <th mat-header-cell *matHeaderCellDef>Username</th>
          <td mat-cell *matCellDef="let merchant">{{ merchant.username }}</td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let merchant">{{ merchant.email }}</td>
        </ng-container>

        <ng-container matColumnDef="role">
          <th mat-header-cell *matHeaderCellDef>Role</th>
          <td mat-cell *matCellDef="let merchant">{{ merchant.role }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let merchant">
            <button mat-icon-button color="primary" (click)="editUser(merchant)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteUser(merchant)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="['username', 'email', 'role', 'actions']"></tr>
        <tr mat-row *matRowDef="let row; columns: ['username', 'email', 'role', 'actions'];"></tr>
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
export class UserManagementComponent implements OnInit {
  users: User[] = [];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading merchants:', error);
        this.snackBar.open('Error loading merchants', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px',
      autoFocus: true,
      restoreFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.addUser(result).subscribe({
          next: () => {
            this.loadUsers();
            this.snackBar.open('Merchant added successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom'
            });
          },
          error: (error) => {
            console.error('Error adding merchant:', error);
            this.snackBar.open('Error adding merchant', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom'
            });
          }
        });
      }
    });
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '400px',
      data: { user },
      autoFocus: true,
      restoreFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.updateUser(user.id, result).subscribe({
          next: () => {
            this.loadUsers();
            this.snackBar.open('Merchant updated successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom'
            });
          },
          error: (error) => {
            console.error('Error updating merchant:', error);
            this.snackBar.open('Error updating merchant', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom'
            });
          }
        });
      }
    });
  }

  deleteUser(user: User) {
    if (confirm('Are you sure you want to delete this merchant?')) {
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers();
          this.snackBar.open('Merchant deleted successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        },
        error: (error) => {
          console.error('Error deleting merchant:', error);
          this.snackBar.open('Error deleting merchant', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        }
      });
    }
  }
}