import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { LoginResponse } from '../models/login-response';

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
      // responseType: 'text',
    });
  }
  saveSession(res: LoginResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
  }
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUsername() {
    return this.getUser()?.username;
  }

  getRole() {
    return this.getUser()?.role;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}
