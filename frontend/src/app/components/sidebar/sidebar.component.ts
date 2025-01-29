import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';

interface MenuItem {
  title: string;
  path: string;
  icon: string;
  roles?: string[];
  adminOnly?: boolean;
  userOnly?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
    MatButtonModule,   
    MatCardModule,
  ]
})
export class SidebarComponent implements OnInit {
  @ViewChild('profileMenu') profileMenu!: MatMenu;
  isOpen = this.getSidebarState();
  menuItems: MenuItem[] = [
    { path: '/products', title: 'Products', icon: 'store', adminOnly: false },
    // { path: '/cart', title: 'Purchase order', icon: 'shopping_basket', userOnly: true },
    { path: '/product-management', title: 'Products Management', icon: 'inventory_2', adminOnly: true },
    { path: '/users', title: 'Merchants Management', icon: 'people', adminOnly: true },
    { path: '/order-history', title: 'Order History', icon: 'history', adminOnly: true },
 
  ];
  router: Router;

  constructor(public authService: AuthService, private _router: Router) {
    this.router = _router;
  }

  ngOnInit(): void {
    // Initialize sidebar state from localStorage
    this.isOpen = this.getSidebarState();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  shouldShowMenuItem(item: MenuItem): boolean {
    if (item.adminOnly && !this.isAdmin()) {
      return false;
    }
    if (item.userOnly && this.isAdmin()) {
      return false;
    }
    return true;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.saveSidebarState(this.isOpen);
  }

  private getSidebarState(): boolean {
    const state = localStorage.getItem('sidebarState');
    return state === null ? true : state === 'true';
  }

  private saveSidebarState(isOpen: boolean): void {
    localStorage.setItem('sidebarState', isOpen.toString());
  }
}