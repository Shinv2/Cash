import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // User Management
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/auth/users`);
  }

  addUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/register`, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/auth/users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/auth/users/${id}`);
  }

 // Product Management
 getProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/products`);
}

addProduct(product: Omit<Product, 'id'>): Observable<Product> {
  return this.http.post<Product>(`${this.apiUrl}/products`, product);
}

updateProduct(id: number, product: Partial<Product>): Observable<Product> {
  return this.http.put<Product>(`${this.apiUrl}/products/${id}`, product);
}

deleteProduct(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
}
}
