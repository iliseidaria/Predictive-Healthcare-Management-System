import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, map, tap, timeout } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private apiUrl = environment.apiUrl + '/api/v1/Auth';
  private healthCheckInterval: any;

  constructor(private router: Router, private http: HttpClient) {
    // Add window close listener
    window.addEventListener('beforeunload', () => {
      this.handleLogout();
    });
    /*
    // Start periodic health check every 30 seconds
    this.healthCheckInterval = setInterval(() => {
      this.checkServerHealth().subscribe(isHealthy => {
        if (!isHealthy) {
          this.handleLogout();
        }
      });
    }, 70000);*/
  }

  ngOnDestroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    window.removeEventListener('beforeunload', () => {
      this.handleLogout();
    });
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { headers: this.getAuthHeaders() });
  }

  validateDoctorId(doctorId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/validate-doctor/${doctorId}`);
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
        this.handleLogout();
      })
    );
  }

  handleLogout(): void {
    if (window.performance.navigation.type !== window.performance.navigation.TYPE_RELOAD) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  checkServerHealth(): Observable<boolean> {
    // Simple ping to root endpoint
    const backendHealth = this.http.options(`${this.apiUrl}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      timeout(3000),
      map(() => true),
      catchError(error => {
        console.log('Backend server status:', error.status);
        return of(false);
      })
    );

    // Check if Angular app is responsive
    const frontendHealth = new Observable<boolean>(observer => {
      const start = performance.now();
      requestAnimationFrame(() => {
        const delta = performance.now() - start;
        observer.next(delta < 100); // Frame rendered within 100ms
        observer.complete();
      });
    });

    return forkJoin([backendHealth, frontendHealth]).pipe(
      map(([backend, frontend]) => {
        console.log('Servers Status - Backend:', backend, 'Frontend:', frontend);
        if (!backend || !frontend) {
          this.handleLogout();
          return false;
        }
        return true;
      })
    );
  }
  validateToken(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

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

  // restoreAuthState(token: string): boolean {
  //   try {
  //     // Attempt to decode the token
  //     const decodedToken: any = jwtDecode(token);

  //     // Check if token is expired
  //     const currentTime = Date.now() / 1000;
  //     if (decodedToken.exp < currentTime) {
  //       localStorage.removeItem('token');
  //       return false;
  //     }

  //     // If token is valid, store it
  //     localStorage.setItem('token', token);
  //     return true;
  //   } catch (error) {
  //     console.error('Error restoring auth state:', error);
  //     localStorage.removeItem('token');
  //     return false;
  //   }
  // }
}
