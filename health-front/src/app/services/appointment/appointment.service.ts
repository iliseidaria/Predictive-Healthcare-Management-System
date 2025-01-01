import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Appointment, AppointmentStatus, PaginatedResponse } from '../../models/appointment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = environment.apiUrl + `/api/v1/Appointment`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getStatusText(status: AppointmentStatus): string {
      switch (status) {
        case AppointmentStatus.Scheduled:
          return 'Scheduled';
        case AppointmentStatus.Completed:
          return 'Completed';
        case AppointmentStatus.Cancelled:
          return 'Cancelled';
        default:
          return 'Unknown';
      }
    }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    console.log('Service sending appointment:', appointment);
    return this.http.post<Appointment>(this.apiUrl, appointment, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(response => console.log('Service received response:', response)),
      catchError(error => {
        console.error('Service error:', error);
        throw error;
      })
    );
  }

  getAppointments(page: number, pageSize: number): Observable<Appointment[]> {
    // Backend typically expects page numbers starting from 0
    const params = { 
      pageNumber: (page - 1).toString(), // Convert to 0-based indexing
      pageSize: pageSize.toString() 
    };
    
    console.log('Requesting appointments with params:', params);
    
    return this.http.get<Appointment[]>(this.apiUrl, {
      headers: this.authService.getAuthHeaders(),
      params
    }).pipe(
      tap(response => console.log('API Response:', response)),
      catchError(error => {
        console.error('API Error:', error);
        throw error;
      })
    );
  }

  getUserAppointments(userId: string, page: number, size: number, options?: { headers?: HttpHeaders }): Observable<Appointment[]> {
    const params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', size.toString());
  
    return this.http.get<Appointment[]>(
      `${this.apiUrl}/user/${userId}`,
      { params, ...options }
    ).pipe(
      tap(response => console.log('API Response:', response)),
      catchError(error => {
        console.error('API Error:', error);
        throw error;
      })
    );
  }

  // getAppointments(page: number, pageSize: number): Observable<PaginatedResponse> {
  //   const params = { page: page.toString(), pageSize: pageSize.toString() };
  //   return this.http.get<PaginatedResponse>(this.apiUrl, {
  //     headers: this.authService.getAuthHeaders(),
  //     params
  //   });
  // }

  // getAppointments(): Observable<Appointment[]> {
  //   return this.http.get<Appointment[]>(this.apiUrl, {
  //     headers: this.authService.getAuthHeaders()
  //   });
  // }

  getAppointmentById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateAppointment(id: string, appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, appointment, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateAppointmentStatus(id: string, status: AppointmentStatus): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/${id}/status`, { status }, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteAppointment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
