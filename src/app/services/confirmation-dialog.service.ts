import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, switchMap } from 'rxjs';
import { ConfirmationDialogBoxComponent } from '../core/confirmation-dialog-box/confirmation-dialog-box.component';
import {
  DeleteConfirmationDialogBoxComponent
} from "../core/delete-confirmation-dialog-box/delete-confirmation-dialog-box.component";

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  constructor(private dialog: MatDialog) {}

  public confirm(message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogBoxComponent, {
      disableClose: true,
      autoFocus: false,
      data: message,
    });

    return dialogRef.afterClosed(); // returns the result
  }

  public confirmUnsavedChanges(message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogBoxComponent, {
      disableClose: true,
      autoFocus: false,
      data: message,
    });

    return dialogRef.afterClosed(); // returns the result
  }

  // Method to show a confirmation dialog and return the user's decision
  public confirmNavigation(
    confirmationMessage: string = `Are you sure you want to Leave this page?<br> Changes you made will not be saved.`,
  ): Observable<boolean> {
    // Show the confirmation dialog and handle the response with `switchMap`
    return this.confirmUnsavedChanges(confirmationMessage).pipe(
      switchMap((response: boolean) => {
        // Allow navigation if the user confirms
        return of(response);
      }),
    );
  }
}
