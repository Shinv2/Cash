import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/products', 
    pathMatch: 'full' 
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component')
      .then(m => m.RegisterComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./products/product-list/product-list.component')
      .then(m => m.ProductListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart.component')
      .then(m => m.CartComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin-dashboard/admin-dashboard.component')
      .then(m => m.AdminDashboardComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  { 
    path: '**', 
    redirectTo: '/products' 
  }
];