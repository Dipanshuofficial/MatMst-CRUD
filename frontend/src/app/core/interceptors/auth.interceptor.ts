import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('jwt_token');

  // Clone the request to seamlessly inject the Authorization header
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If the backend rejects the token, clear it and force a login
      if (error.status === 401) {
        localStorage.removeItem('jwt_token');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
