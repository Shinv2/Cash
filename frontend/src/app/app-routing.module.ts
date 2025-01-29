import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProductManagementComponent } from './admin/product-management/product-management.component';
import { CartManagementComponent } from './admin/cart-management/cart-management.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'products',
    component:ProductManagementComponent
  },
  {
    path: 'cart',
    component:CartManagementComponent
  },
  {
    path: 'admin',
    component:UserManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}

