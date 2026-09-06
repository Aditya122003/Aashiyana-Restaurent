import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { MenuItem, Category } from '../models/restaurant.models';
import { getApiBaseUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private get apiUrl() {
    return getApiBaseUrl();
  }

  categories = signal<Category[]>([
    {
      id: 'all',
      name: 'All Items',
      icon: '🍽️',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'dishes',
      name: 'Dishes',
      icon: '🍛',
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'sweets',
      name: 'Sweets',
      icon: '🍬',
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'chinese',
      name: 'Chinese',
      icon: '🥟',
      image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'south_indian',
      name: 'South Indian',
      icon: '🥞',
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'bakery',
      name: 'Bakery & Cakes',
      icon: '🎂',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'beverages',
      name: 'Beverages',
      icon: '🥤',
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=400&q=80'
    }
  ]);
  menuItems = signal<MenuItem[]>([]);
  isLoading = signal<boolean>(false);
  selectedCategory = signal<string>('all');
  searchQuery = signal<string>('');
  vegOnly = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadCategories().subscribe();
  }

  loadCategories(): Observable<any> {
    return this.http.get<{ success: boolean; categories: Category[] }>(`${this.apiUrl}/categories`).pipe(
      tap(res => {
        if (res.success) {
          this.categories.set(res.categories);
        }
      })
    );
  }

  loadMenu(branchId?: string): Observable<any> {
    this.isLoading.set(true);
    let url = `${this.apiUrl}/menu`;
    if (branchId) {
      url += `?branchId=${branchId}`;
    }
    return this.http.get<{ success: boolean; items: MenuItem[] }>(url).pipe(
      tap({
        next: (res) => {
          if (res.success) {
            this.menuItems.set(res.items);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      })
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('ashiana_admin_token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  createMenuItem(data: Partial<MenuItem>): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/menu`, data, { headers: this.getAuthHeaders() });
  }

  updateMenuItem(id: string, data: Partial<MenuItem>): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/menu/${id}`, data, { headers: this.getAuthHeaders() });
  }

  updateBranchPrice(itemId: string, branchId: string, price: number, available: boolean, image?: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/admin/menu/${itemId}/branch-price`,
      { branchId, price, available, image },
      { headers: this.getAuthHeaders() }
    );
  }

  deleteMenuItem(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/menu/${id}`, { headers: this.getAuthHeaders() });
  }
}
