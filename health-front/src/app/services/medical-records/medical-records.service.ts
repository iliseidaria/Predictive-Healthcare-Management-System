import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

// Medical Record Interface
export interface MedicalRecord {
  recordId: string;
  patientId: string;
  date: string;
  diagnosis: string;
  prescriptions: string[]; // Adjust based on your Prescription model
  notes: string;
}

@Injectable({
  providedIn: 'root',
})
export class MedicalRecordsService {
  private apiUrl = environment.apiUrl + `/api/v1/MedicalRecord`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Get a paginated list of medical records for a user.
   * @param userId - The ID of the user.
   * @param page - The current page number.
   * @param size - The number of records per page.
   * @returns An observable of the user's medical records.
   */
  getUserMedicalRecords(
    userId: string,
    page: number,
    size: number
  ): Observable<MedicalRecord[]> {
    const params = new HttpParams()
      .set('page', (page - 1).toString()) // Backend expects 0-based page indexing
      .set('size', size.toString());

    return this.http
      .get<MedicalRecord[]>(`${this.apiUrl}/user/${userId}`, {
        headers: this.authService.getAuthHeaders(),
        params,
      })
      .pipe(
        tap((records) => console.log('Fetched medical records:', records)),
        catchError((error) => {
          console.error('Error fetching medical records:', error);
          throw error;
        })
      );
  }

  /**
   * Get a specific medical record by its ID.
   * @param recordId - The ID of the medical record.
   * @returns An observable of the medical record.
   */
  getMedicalRecordById(recordId: string): Observable<MedicalRecord> {
    return this.http
      .get<MedicalRecord>(`${this.apiUrl}/${recordId}`, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        tap((record) => console.log('Fetched medical record:', record)),
        catchError((error) => {
          console.error('Error fetching medical record by ID:', error);
          throw error;
        })
      );
  }

  /**
   * Create a new medical record.
   * @param record - The medical record to create.
   * @returns An observable of the created medical record.
   */
  createMedicalRecord(record: MedicalRecord): Observable<MedicalRecord> {
    return this.http
      .post<MedicalRecord>(this.apiUrl, record, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        tap((newRecord) => console.log('Created medical record:', newRecord)),
        catchError((error) => {
          console.error('Error creating medical record:', error);
          throw error;
        })
      );
  }

  /**
   * Update an existing medical record.
   * @param recordId - The ID of the medical record to update.
   * @param record - The updated medical record.
   * @returns An observable of the updated medical record.
   */
  updateMedicalRecord(
    recordId: string,
    record: MedicalRecord
  ): Observable<MedicalRecord> {
    return this.http
      .put<MedicalRecord>(`${this.apiUrl}/${recordId}`, record, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        tap((updatedRecord) =>
          console.log('Updated medical record:', updatedRecord)
        ),
        catchError((error) => {
          console.error('Error updating medical record:', error);
          throw error;
        })
      );
  }

  /**
   * Delete a medical record by its ID.
   * @param recordId - The ID of the medical record to delete.
   * @returns An observable of void.
   */
  deleteMedicalRecord(recordId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${recordId}`, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        tap(() => console.log(`Deleted medical record with ID: ${recordId}`)),
        catchError((error) => {
          console.error('Error deleting medical record:', error);
          throw error;
        })
      );
  }
}
