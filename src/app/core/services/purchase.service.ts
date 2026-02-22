import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private baseUrl = environment.apiBaseUrl;

  // private API = 'http://localhost:8080/purchases';

  constructor(private http: HttpClient) {}

  // ✅ Add Purchase
  addPurchase(data: any): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(this.baseUrl, data, { headers });
  }
  bulkPurchase(data: any[]) {
    const token = localStorage.getItem('token');

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return this.http.post(`${this.baseUrl}/purchases/bulk`, data, {
      headers,
    });
  }

  // ✅ Get All Purchases
  getAll(): Observable<any[]> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(this.baseUrl, { headers });
  }
  getItems() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(`${this.baseUrl}/items`, { headers });
  }
}
