import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private baseUrl = 'https://localhost:7192/api/v1/Patients'; // Replace with your API base URL

  constructor(private http: HttpClient) {}

  getAllPatients(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get(this.baseUrl, { params });
  }

  getPatientById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createPatient(patientData: any): Observable<any> {
    return this.http.post(this.baseUrl, patientData, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  updatePatient(id: string, patientData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, patientData);
  }

  deletePatient(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
