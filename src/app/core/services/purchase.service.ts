import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private baseUrl = `${environment.apiBaseUrl}/purchases`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // ✅ Add Purchase
  addPurchase(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data, {
      headers: this.getHeaders(),
    });
  }

  // ✅ Bulk Purchase
  bulkPurchase(data: any[]) {
    return this.http.post(`${this.baseUrl}/bulk`, data, {
      headers: this.getHeaders(),
    });
  }

  // ✅ Get All Purchases
  getAll(): Observable<any[]> {
    return this.http
      .get<any[]>(this.baseUrl, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((purchases) =>
          purchases.sort((a, b) => {
            const dateA = new Date(a?.purchaseDate || 0).getTime();
            const dateB = new Date(b?.purchaseDate || 0).getTime();

            return dateB - dateA; // latest first
          }),
        ),
      );
  }
}
