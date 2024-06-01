import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog-box',
  templateUrl: './delete-confirmation-dialog-box.component.html',
  styleUrls: ['./delete-confirmation-dialog-box.component.sass'],
})
export class DeleteConfirmationDialogBoxComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public confirmationMessage: boolean,
  ) {}
  onCancelClick() {
    this.dialogRef.close(false);
  }
  onYesClick() {
    this.dialogRef.close(true);
  }
}
