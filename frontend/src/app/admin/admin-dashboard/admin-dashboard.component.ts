import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserManagementComponent } from '../user-management/user-management.component';
import { ProductManagementComponent } from '../product-management/product-management.component';
import { OrderHistoryComponent } from '../order-history/order-history.component';
import { AuthService } from '../../core/services/auth.service';

//ajillj bgn n
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    UserManagementComponent,
    ProductManagementComponent,
    OrderHistoryComponent
  ],
  template: `
    <div class="admin-dashboard" role="main">
      <mat-tab-group [selectedIndex]="0" (selectedIndexChange)="onTabChange($event)">
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>people</mat-icon>
            <span>Merchants Management</span>
          </ng-template>
          <app-user-management></app-user-management>
        </mat-tab>
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>inventory_2</mat-icon>
            <span>Products Management</span>
          </ng-template>
          <app-product-management></app-product-management>
        </mat-tab>
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>receipt_long</mat-icon>
            <span>Order History</span>
          </ng-template>
          <app-order-history></app-order-history>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 20px;
      max-width: 1200px;
      margin: 80px auto 0; /* Added top margin to account for fixed toolbar */
    }

    mat-tab-group {
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    ::ng-deep .mat-tab-label {
      height: 64px !important;
    }

    ::ng-deep .mat-tab-label mat-icon {
      margin-right: 8px;
    }

    ::ng-deep .mat-tab-label-active {
      opacity: 1 !important;
    }
  `]
})
export class AdminDashboardComponent {
  username: string = '';

  constructor(
    private authService: AuthService
  ) {
  }

  logout() {
    this.authService.logout();
  }

  onTabChange(index: number) {
    // Ensure proper focus management when switching tabs
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) {
        activeElement.blur();
      }
    });
  }
}
