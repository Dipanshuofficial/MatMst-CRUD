import { isDevMode } from '@angular/core';

export const getApiUrl = (): string => {
  const PROD_BACKEND_URL = 'https://your-live-backend-url.onrender.com';

  return isDevMode() ? 'http://localhost:3000/api' : `${PROD_BACKEND_URL}/api`;
};
