import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiBaseUrl;

  // private api = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/auth/login`, data, {
      responseType: 'text',
    });
  }
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}
