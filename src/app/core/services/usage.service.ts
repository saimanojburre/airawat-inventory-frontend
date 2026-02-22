import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsageService {
  private API = 'http://localhost:8081';

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
    return this.http.post(`${this.API}/usage/bulk`, data, {
      headers: this.getHeaders(),
    });
  }

  // ✅ AVAILABLE STOCK
  getAvailableStock(itemId: number) {
    return this.http.get<number>(`${this.API}/inventory/stock/${itemId}`, {
      headers: this.getHeaders(),
    });
  }

  // ✅ ITEMS DROPDOWN
  getItems() {
    return this.http.get<any[]>(`${this.API}/items`, {
      headers: this.getHeaders(),
    });
  }
}
