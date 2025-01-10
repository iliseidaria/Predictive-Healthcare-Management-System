import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Prescription, PaginatedPrescriptionResponse } from '../../models/prescription';

interface RequestOptions {
  headers?: HttpHeaders;
  params?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private apiUrl = `${environment.apiUrl}/api/v1/Prescription`;

  constructor(private http: HttpClient) { }

  getAllPrescriptions(page: number, size: number, options?: RequestOptions): Observable<PaginatedPrescriptionResponse> {
    return this.http.get<PaginatedPrescriptionResponse>
    (`${this.apiUrl}?page=${page}&size=${size}`, { ...options });
  }

  getPrescriptionById(id: string, options?: RequestOptions): Observable<Prescription> {
    return this.http.get<Prescription>(`${this.apiUrl}/${id}`, options);
  }

  createPrescription(prescription: Partial<Prescription>, options?: RequestOptions): Observable<Prescription> {
    return this.http.post<Prescription>(this.apiUrl, prescription, options);
  }

  updatePrescription(id: string, prescription: Partial<Prescription>, options?: RequestOptions): Observable<Prescription> {
    return this.http.put<Prescription>(`${this.apiUrl}/${id}`, prescription, options);
  }

  deletePrescription(id: string, options?: RequestOptions): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, options);
  }

  getPrescriptionsByPatientId(patientId: string, page: number, size: number, options?: RequestOptions): Observable<PaginatedPrescriptionResponse> {
    return this.http.get<PaginatedPrescriptionResponse>
    (`${this.apiUrl}/patient/${patientId}?page=${page}&size=${size}`, { ...options });
  }

  //inca nu avem
  // getPrescriptionsByDoctorId(doctorId: string, page: number, size: number, options?: RequestOptions): Observable<PaginatedPrescriptionResponse> {
  //   return this.http.get<PaginatedPrescriptionResponse>
  //   (`${this.apiUrl}/doctor/${doctorId}?page=${page}&size=${size}`, { ...options });
  // }
}