import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private baseUrl = `${environment.apiBaseUrl}/items`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // ✅ Items dropdown
  getItems() {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/items`, {
      headers: this.getHeaders(),
    });
  }

  // ✅ Bulk Item save
  bulkSave(data: any[]) {
    return this.http.post(`${this.baseUrl}/bulk`, data, {
      headers: this.getHeaders(),
    });
  }

  fileSave(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/upload/items`, formData, {
      headers: this.getHeaders(), // ✅ NO content-type
    });
  }
}
