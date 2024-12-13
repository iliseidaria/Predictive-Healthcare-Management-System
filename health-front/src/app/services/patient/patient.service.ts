import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  createPatient(patientData: any): Observable<any> {
    return this.http.post(this.baseUrl, patientData, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
/*
  createPatient(patientData: any): Observable<any> {
    // If dateOfBirth is not a Date object, convert it to one
    if (!(patientData.dateOfBirth instanceof Date)) {
      patientData.dateOfBirth = new Date(patientData.dateOfBirth); // Convert to Date object
    }

    // Ensure dateOfBirth is a valid Date object
    if (isNaN(patientData.dateOfBirth.getTime())) {
      console.error('Invalid dateOfBirth:', patientData.dateOfBirth);
      throw new Error('Invalid dateOfBirth');
    }

    // Create a new variable to handle gender mapping (0, 1, 2 -> Male, Female, Other)
    let genderEnum: string;

    // If gender is a number (0, 1, 2), convert it to a string (Male, Female, Other)
    switch (patientData.gender) {
      case 0:
        genderEnum = 'Male';
        break;
      case 1:
        genderEnum = 'Female';
        break;
      case 2:
        genderEnum = 'Other';
        break;
      default:
        console.error('Invalid gender:', patientData.gender);
        throw new Error('Invalid gender');
    }

    // Now we have genderEnum which is 'Male', 'Female', or 'Other'
    const formData = { ...patientData, gender: genderEnum };

    // Send the formData via HTTP POST
    return this.http.post(this.baseUrl, formData, {
      headers: { 'Content-Type': 'application/json' },
    });
  }*/

  updatePatient(id: string, patientData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, patientData);
  }

  deletePatient(id: string, options?: { headers?: HttpHeaders }): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, options);
  }
}
