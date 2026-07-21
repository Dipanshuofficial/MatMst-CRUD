import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

// Prevents unauthenticated users from accessing protected pages
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('jwt_token');

  if (token) return true;

  router.navigate(['/login']);
  return false;
};

// Prevents authenticated users from seeing the login page again
export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('jwt_token');

  if (!token) return true;

  router.navigate(['/dashboard']);
  return false;
};
