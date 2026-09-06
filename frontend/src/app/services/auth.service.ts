import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AdminUser } from '../models/restaurant.models';
import { getApiBaseUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private get apiUrl() {
    return getApiBaseUrl();
  }

  currentUser = signal<AdminUser | null>(null);
  token = signal<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const savedToken = localStorage.getItem('ashiana_admin_token');
    const savedUser = localStorage.getItem('ashiana_admin_user');
    if (savedToken && savedUser) {
      this.token.set(savedToken);
      try {
        this.currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        this.logout();
      }
    }
  }

  isLoggedIn(): boolean {
    return !!this.token();
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<{ success: boolean; token: string; user: AdminUser; message: string }>(
      `${this.apiUrl}/admin/login`,
      credentials
    ).pipe(
      tap(res => {
        if (res.success && res.token) {
          this.token.set(res.token);
          this.currentUser.set(res.user);
          localStorage.setItem('ashiana_admin_token', res.token);
          localStorage.setItem('ashiana_admin_user', JSON.stringify(res.user));
        }
      })
    );
  }

  logout() {
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('ashiana_admin_token');
    localStorage.removeItem('ashiana_admin_user');
    this.router.navigate(['/superadmin']);
  }

  getOrders(branchId?: string, date?: string): Observable<any> {
    const token = this.token() || localStorage.getItem('ashiana_admin_token') || '';
    let url = `${this.apiUrl}/admin/orders`;
    const params: string[] = [];
    if (branchId && branchId !== 'all') params.push(`branchId=${branchId}`);
    if (date) params.push(`date=${date}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.http.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
