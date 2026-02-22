import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private API = 'http://localhost:8081/purchases';

  constructor(private http: HttpClient) {}

  // ✅ Add Purchase
  addPurchase(data: any): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(this.API, data, { headers });
  }
  bulkPurchase(data: any[]) {
    const token = localStorage.getItem('token');

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return this.http.post('http://localhost:8081/purchases/bulk', data, {
      headers,
    });
  }

  // ✅ Get All Purchases
  getAll(): Observable<any[]> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(this.API, { headers });
  }
  getItems() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>('http://localhost:8081/items', { headers });
  }
}
