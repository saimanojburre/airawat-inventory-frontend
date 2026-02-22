import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inventory } from 'src/app/inventory.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private baseUrl = environment.apiBaseUrl;

  // private api = 'http://localhost:8080/inventory';

  constructor(private http: HttpClient) {}

  getInventory() {
    const token = localStorage.getItem('token');

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return this.http.get<Inventory[]>(`${this.baseUrl}/inventory`, {
      headers,
    });
  }
}
