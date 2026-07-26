import { isDevMode } from '@angular/core';

export const getApiUrl = (): string => {
  const PROD_BACKEND_URL = 'https://mat-mst-crud-seven.vercel.app';

  return isDevMode() ? 'http://localhost:3000/api' : `${PROD_BACKEND_URL}/api`;
};
