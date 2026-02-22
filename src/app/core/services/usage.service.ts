import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class UsageService {
  private baseUrl = environment.apiBaseUrl;

  // private API = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // ✅ Common Headers (single place)
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // ✅ BULK USAGE
  bulkUsage(data: any[]) {
    return this.http.post(`${this.baseUrl}/usage/bulk`, data, {
      headers: this.getHeaders(),
    });
  }

  // ✅ AVAILABLE STOCK
  getAvailableStock(itemId: number) {
    return this.http.get<number>(`${this.baseUrl}/inventory/stock/${itemId}`, {
      headers: this.getHeaders(),
    });
  }

  getUsage() {
    return this.http.get<any[]>(`${this.baseUrl}/usage`, {
      headers: this.getHeaders(),
    });
  }
  // ✅ ITEMS DROPDOWN
  getItems() {
    return this.http.get<any[]>(`${this.baseUrl}/items`, {
      headers: this.getHeaders(),
    });
  }
}
