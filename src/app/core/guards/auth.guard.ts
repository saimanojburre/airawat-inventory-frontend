import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // check login status
  if (authService.isLoggedIn()) {
    return true;
  }

  // redirect to login if not authenticated
  router.navigate(['/']);
  return false;
};
