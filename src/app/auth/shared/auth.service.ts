import { Injectable } from '@angular/core';
import { AUTH_DATA, UserData } from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  data: UserData | null = null;

  get isAuthenticated(): boolean {
    const status = !!localStorage.getItem(AUTH_DATA);
    return status;
  }

  constructor() { }
}
