import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  private isLogoutInProgress = false;

  setLogoutInProgress(value: boolean): void {
    this.isLogoutInProgress = value;
  }

  getLogoutInProgress(): boolean {
    return this.isLogoutInProgress;
  }
}
