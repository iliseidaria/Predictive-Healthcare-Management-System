import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private baseUrl = environment.apiUrl + '/api/v1/Auth/users';

  constructor(private http: HttpClient) {}

  getAllDoctors(page: number, size: number, options?: { headers?: HttpHeaders }): Observable<any> {
    const params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', size.toString())
      .set('role', 'doctor'); // Filter by role 'doctor'

    return this.http.get<any>(`${this.baseUrl}`, { params, ...options });
  }

  deleteDoctor(id: string, options?: { headers?: HttpHeaders }): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, options);
  }

  // Search Doctors with Role Filter
  searchDoctors(searchTerm: string, page: number, size: number, options?: { headers?: HttpHeaders }): Observable<any> {
    const params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('pageNumber', page.toString())
      .set('pageSize', size.toString())
      .set('role', 'doctor'); // Filter by role 'doctor'

    return this.http.get<any>(`${this.baseUrl}/search`, { params, ...options });
  }
}