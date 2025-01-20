import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProductsModule } from '../../../backend/src/products/products.module';
import { CartModule } from '../../../backend/src/cart/cart.module';
import { AdminModule } from '../../../backend/src/admin/admin.module';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'products',
    loadChildren: () => import('../../../backend/src/products/products.module').then(m => m.ProductsModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('../../../backend/src/cart/cart.module').then(m => m.CartModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('../../../backend/src/admin/admin.module').then(m => m.AdminModule)
  }
];
