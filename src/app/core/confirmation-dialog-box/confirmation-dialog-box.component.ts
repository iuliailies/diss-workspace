import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog-box',
  templateUrl: './confirmation-dialog-box.component.html',
  styleUrls: ['./confirmation-dialog-box.component.sass'],
})
export class ConfirmationDialogBoxComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public confirmationMessage: boolean,
  ) {}
  onCancelClick() {
    this.dialogRef.close(false);
  }
  onYesClick() {
    this.dialogRef.close(true);
  }
}
