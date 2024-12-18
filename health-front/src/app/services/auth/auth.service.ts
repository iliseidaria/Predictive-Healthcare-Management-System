import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/api/v1/Auth';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { headers: this.getAuthHeaders() });
  }

  register(user: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, { headers: this.getAuthHeaders() });
  }

  logout(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        localStorage.removeItem('token');
      })
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getCurrentUser(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token);
      return {
        username: decodedToken.unique_name,
        email: decodedToken.email,
        role: decodedToken.role
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}