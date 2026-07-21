import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { getApiUrl } from '../config/api.config';

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${getApiUrl()}/auth`;

  // "Injecting" the HttpClient into our service
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('jwt_token', response.token);
        }
      }),
      catchError(this.handleError),
    );
  }
  register(email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/register`, { email, password })
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown Error Occurred! ';
    if (error.status === 401) {
      errorMessage = 'Invalid Email or Password.';
    } else if (error.status === 400) {
      errorMessage = 'Please Provide both email and password.';
    }
    return throwError(() => new Error(errorMessage));
  }
}
