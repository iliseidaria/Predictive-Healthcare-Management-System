import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/api/v1/Auth';

  constructor(private router: Router, private http: HttpClient) {}

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
    localStorage.removeItem('token');
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        localStorage.removeItem('token');
      })
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // getUserRole(): string | null {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     try {
  //       const payload = JSON.parse(atob(token.split('.')[1]));
  //       console.log('Token payload:', payload); // Debug log
  //       return payload.role;
  //     } catch (error) {
  //       console.error('Error parsing token:', error);
  //       return null;
  //     }
  //   }
  //   return null;
  // }

  // getUserRole(): string | null {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     return null;
  //   }
  //   const payload = JSON.parse(atob(token.split('.')[1]));
  //   return payload.role || null;
  // }

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
      console.log('Decoded token claims:', decodedToken);

      // Extract standard JWT claims and custom claims
      return {
        id: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decodedToken.sub,
        username: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decodedToken.name,
        email: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || decodedToken.email,
        role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decodedToken.role
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  restoreAuthState(token: string): boolean {
    try {
      // Attempt to decode the token
      const decodedToken: any = jwtDecode(token);
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token');
        return false;
      }

      // If token is valid, store it
      localStorage.setItem('token', token);
      return true;
    } catch (error) {
      console.error('Error restoring auth state:', error);
      localStorage.removeItem('token');
      return false;
    }
  }

  checkTokenExpiration(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      
      if (Date.now() >= expirationTime) {
        this.handleLogout();
        return false;
      }
      return true;
    } catch (error) {
      this.handleLogout();
      return false;
    }
  }

  private handleLogout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}