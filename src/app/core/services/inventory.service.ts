import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inventory } from 'src/app/inventory.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private api = 'http://localhost:8081/inventory';

  constructor(private http: HttpClient) {}

  getInventory() {
    const token = localStorage.getItem('token');

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return this.http.get<Inventory[]>('http://localhost:8081/inventory', {
      headers,
    });
  }
}
