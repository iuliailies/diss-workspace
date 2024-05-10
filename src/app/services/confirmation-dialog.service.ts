import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, switchMap } from 'rxjs';
import { ConfirmationDialogBoxComponent } from '../core/confirmation-dialog-box/confirmation-dialog-box.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  private isLogoutInProgress = false;
  constructor(private dialog: MatDialog) {}

  public confirm(message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogBoxComponent, {
      disableClose: true,
      autoFocus: false,
      data: message,
    });

    return dialogRef.afterClosed(); // returns the result
  }

  // Method to show a confirmation dialog and return the user's decision
  public confirmNavigation(
    confirmationMessage: string = 'You have unsaved changes. Do you want to continue?',
  ): Observable<boolean> {
    // Show the confirmation dialog and handle the response with `switchMap`
    return this.confirm(confirmationMessage).pipe(
      switchMap((response: boolean) => {
        // Allow navigation if the user confirms
        return of(response);
      }),
    );
  }
}
