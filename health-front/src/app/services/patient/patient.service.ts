import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private baseUrl = environment.apiUrl + '/api/v1/Patients'; // Replace with your API base URL

  constructor(private http: HttpClient) {
  }

  getAllPatients(page: number, size: number, options?: { headers?: HttpHeaders }): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get(this.baseUrl, { params, ...options });
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
