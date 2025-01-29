import { Component, OnInit } from '@angular/core';
import { Router,  RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    MatMenuModule,
    MatSidenavModule,
    MatCardModule
  ]
})
export class NavbarComponent implements OnInit {
  constructor(public authService: AuthService,public router: Router) {}

  ngOnInit(): void {}

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  shouldShowMenuItem(item: any): boolean {
    if (item.adminOnly) return this.isAdmin();
    if (item.userOnly) return !this.isAdmin();
    return true;
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}