import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { CartComponent } from './cart/cart.component';
import { ProductManagementComponent } from './admin/product-management/product-management.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { OrderHistoryComponent } from './admin/order-history/order-history.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { 
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'products',
    component: ProductListComponent
  },
  {
    path: 'product-management',
    component: ProductManagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    component: UserManagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order-history',
    component: OrderHistoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  }
];