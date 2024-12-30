import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl + '/api/v1/Admin';

  constructor(private http: HttpClient) {
  }

  getAllUsers(page: number, size: number, options?: { headers?: HttpHeaders }): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get(this.baseUrl, { params, ...options });
  }

  deleteUser(userId: string, options?: { headers?: HttpHeaders }): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}`, options);
  }
}
