import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LogoutService } from '../services/logout.service';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UnsavedChangesGuardService {
  constructor(private logoutService: LogoutService) {}
  canDeactivate(
    component: CanComponentDeactivate,
  ): Observable<boolean> | boolean {
    // Check if logout action is in progress
    if (this.logoutService.getLogoutInProgress()) {
      // Allow deactivation if logout action is in progress
      return true;
    }
    // Otherwise, call the component's `canDeactivate` method and use the response
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
