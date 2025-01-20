import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <ng-container *ngIf="authService.isLoggedIn()">
      <mat-toolbar color="primary">
        <span class="spacer"></span>
        <button mat-button routerLink="/products">
          <mat-icon>store</mat-icon>
          Products
        </button>

        <ng-container *ngIf="!authService.isAdmin()">
          <button mat-button routerLink="/cart">
            <mat-icon>shopping_cart</mat-icon>
            Cart
          </button>
        </ng-container>

        <ng-container *ngIf="authService.isAdmin()">
          <button mat-button routerLink="/admin">
            <mat-icon>admin_panel_settings</mat-icon>
            <span>Admin Panel</span>
          </button>
        </ng-container>

        <button mat-icon-button [matMenuTriggerFor]="profileMenu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #profileMenu="matMenu">
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </mat-toolbar>
    </ng-container>

    <ng-container *ngIf="!authService.isLoggedIn()">
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </ng-container>

    <ng-container *ngIf="authService.isLoggedIn()">
      <main class="content with-toolbar">
        <router-outlet></router-outlet>
      </main>
    </ng-container>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    mat-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 2;
      
      .mat-icon {
        margin-right: 8px;
      }
      
      a {
        text-decoration: none;
        color: white;
        display: flex;
        align-items: center;
        
        &.active {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
    }

    .content {
      flex: 1;
      box-sizing: border-box;
      width: 100%;
      margin-left: auto;
      margin-right: auto;
    }

    .content.with-toolbar {
      margin-top: 64px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    ::ng-deep .app-menu-panel {
      min-width: 200px;
      
      .mat-mdc-menu-item {
        display: flex;
        align-items: center;
        gap: 8px;
        
        mat-icon {
          margin-right: 8px;
        }
      }
    }

    @media (max-width: 599px) {
      .content {
        margin-top: 56px;
        padding: 16px;
      }
      
      mat-toolbar {
        .hide-small {
          display: none;
        }
      }
    }
  `]
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

// Make sure the component is exported//
export default AppComponent;