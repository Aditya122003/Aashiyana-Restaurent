import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Reservation } from '../models/restaurant.models';
import { getApiBaseUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private get apiUrl() {
    return getApiBaseUrl();
  }

  isModalOpen = signal<boolean>(false);
  minDate = signal<string>('');
  maxDate = signal<string>('');
  timeSlots = signal<string[]>([]);
  recentReservation = signal<Reservation | null>(null);

  constructor(private http: HttpClient) {
    this.calculateDefault15DaysWindow();
    this.fetchWindow();
  }

  private calculateDefault15DaysWindow() {
    const today = new Date();
    const formatYMD = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    this.minDate.set(formatYMD(today));

    const max15 = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);
    this.maxDate.set(formatYMD(max15));

    this.timeSlots.set([
      "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
      "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
      "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM",
      "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM",
      "09:00 PM", "09:30 PM", "10:00 PM"
    ]);
  }

  fetchWindow(): Observable<any> {
    return this.http.get<{
      success: boolean;
      minDate: string;
      maxDate: string;
      allowedTimeSlots: string[];
    }>(`${this.apiUrl}/reservations/window`).pipe(
      tap(res => {
        if (res.success) {
          this.minDate.set(res.minDate);
          this.maxDate.set(res.maxDate);
          if (res.allowedTimeSlots?.length) {
            this.timeSlots.set(res.allowedTimeSlots);
          }
        }
      })
    );
  }

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  createReservation(data: Reservation): Observable<any> {
    return this.http.post<{ success: boolean; message: string; reservation: Reservation }>(
      `${this.apiUrl}/reservations`,
      data
    ).pipe(
      tap(res => {
        if (res.success && res.reservation) {
          this.recentReservation.set(res.reservation);
        }
      })
    );
  }

  // Admin methods
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('ashiana_admin_token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getAllReservations(branchId?: string, date?: string): Observable<any> {
    let url = `${this.apiUrl}/admin/reservations`;
    const params: string[] = [];
    if (branchId && branchId !== 'all') params.push(`branchId=${branchId}`);
    if (date) params.push(`date=${date}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.http.get(url, { headers: this.getAuthHeaders() });
  }

  getTodayReservations(branchId?: string): Observable<any> {
    let url = `${this.apiUrl}/admin/reservations/today`;
    if (branchId && branchId !== 'all') url += `?branchId=${branchId}`;
    return this.http.get(url, { headers: this.getAuthHeaders() });
  }

  updateStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/reservations/${id}/status`, { status }, { headers: this.getAuthHeaders() });
  }
}
