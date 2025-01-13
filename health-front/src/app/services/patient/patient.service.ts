import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UsersResponse } from '../../models/user';
@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private baseUrl = environment.apiUrl + '/api/v1/Auth/users';

  constructor(private http: HttpClient) {
  }

  getAllPatients(page: number, size: number, options?: { headers?: HttpHeaders }): Observable<any> {
    const params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', size.toString())
      .set('role', 'patient'); // Add role filter parameter
  
    return this.http.get<any>(`${this.baseUrl}`, { params, ...options });
  }

  getAllUsers(page: number, size: number, options?: { headers?: HttpHeaders }): Observable<UsersResponse> {
    const params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', size.toString());
      
    console.log('Requesting users with params:', { page, size });
    console.log('Headers:', options?.headers);
    
    return this.http.get<UsersResponse>(`${this.baseUrl}`, { params, ...options })
      .pipe(
        tap(response => console.log('Service response:', response)),
        catchError(error => {
          console.error('Service error:', error);
          throw error;
        })
      );
  }

  getPatientById(id: string, options?: { headers?: HttpHeaders }): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, options);
  }

  createPatient(patientData: any, options?: { headers?: HttpHeaders }): Observable<any> {
    return this.http.post<any>(this.baseUrl, patientData, options).pipe(
      tap({
        next: (response) => console.log('Service received response:', response),
        error: (error) => console.error('Service received error:', error),
        complete: () => console.log('Service request completed')
      })
    );
  }

  updatePatient(id: string, patientData: any, options?: { headers?: HttpHeaders }): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, patientData, options);
  }

  deletePatient(id: string, options?: { headers?: HttpHeaders }): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, options);
  }
}
