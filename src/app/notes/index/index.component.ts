import { Component, OnInit } from '@angular/core';
import { PATHS } from '../../app.constants';
import { GetEmployeeDocument } from '../../data-types/notes.model';
import { NoteService } from '../../services/note.service';
import { ConfirmationDialogBoxComponent } from '../../core/confirmation-dialog-box/confirmation-dialog-box.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { NotificationType } from '../../data-types/notification.model';
import { ErrorResponseModel } from '../../data-types/error-response.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.sass',
})
export class IndexComponent implements OnInit {
  PATHS = PATHS;
  documents: GetEmployeeDocument[] = [];
  userId = localStorage.getItem('userId');
  loading = true;

  constructor(
    private noteService: NoteService,
    private dialogBox: MatDialog,
    private notificationService: NotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(() => {
      this.fetchDocuments();
    });
  }

  matchesUserId(documentUserId: number): boolean {
    return documentUserId.toString() === this.userId;
  }

  fetchDocuments(): void {
    this.loading = true;
    this.noteService.getDocuments().subscribe((documents) => {
      this.documents = documents;
      this.loading = false;
    });
  }

  deleteDocument(event: any, document: GetEmployeeDocument) {
    event.stopPropagation();

    const dialogResponse = this.dialogBox.open(ConfirmationDialogBoxComponent, {
      data: `Are you sure you want to delete document: ${document.title} ?`,
      disableClose: true,
      autoFocus: false,
    });

    dialogResponse.afterClosed().subscribe((response) => {
      if (response) {
        this.noteService.deleteDocument(document.id).subscribe({
          next: () => {
            this.fetchDocuments();
            this.notificationService.notify({
              message: 'Document deleted successfully!',
              type: NotificationType.error,
            });
          },
          error: (error: any) => {
            if (error.error instanceof ErrorEvent) {
              this.notificationService.notify({
                message: 'An error occurred! Please try again later!',
                type: NotificationType.error,
              });
            } else {
              const errResponse: ErrorResponseModel =
                error.error as ErrorResponseModel;
              this.notificationService.notify({
                message: errResponse.errorMessage,
                type: NotificationType.error,
              });
            }
          },
        });
      }
    });
  }

  getUserInitials(document: any): string {
    return document.user.firstname[0] + document.user.lastname[0];
  }

  getUserName(document: any): string {
    return document.user.firstname + ' ' + document.user.lastname;
  }

  viewDocument(id: any) {
    this.router.navigate([`notes/${id}`]);
  }
}
