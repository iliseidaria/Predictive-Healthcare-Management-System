import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { User, UsersResponse } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl + '/api/v1/Admin/users';

  constructor(private http: HttpClient) {
  }

  getAllUsers(page: number, size: number, options?: { headers?: HttpHeaders }): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<UsersResponse>(this.baseUrl, { params, ...options });
  }

  deleteUser(userId: string, options?: { headers?: HttpHeaders }): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}`, options);
  }

  updateUser(userId: string, userData: Partial<User>, options?: { headers?: HttpHeaders }): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${userId}`, userData, options);
  }

  getUserById(userId: string, options?: { headers?: HttpHeaders }): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${userId}`, options);
  }
}
