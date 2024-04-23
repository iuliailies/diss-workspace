import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EmployeeDocument} from '../../data-types/notes.model';
import {PATHS} from '../../app.constants';
import {NoteService} from '../../services/note.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationType} from '../../data-types/notification.model';
import {ErrorResponseModel} from '../../data-types/error-response.model';
import {NotificationService} from '../../services/notification.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogBoxComponent} from '../../core/confirmation-dialog-box/confirmation-dialog-box.component';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrl: './note.component.sass',
})
export class NoteComponent implements OnInit {
  PATHS = PATHS;
  @ViewChild('noteContent') noteContent!: ElementRef;

  userId = localStorage.getItem('userId');
  loading = false;
  readOnly = false;
  existsUploadedFile = false;
  keywords: string[] = [];
  document: any;

  constructor(
    private noteService: NoteService,
    private notificationService: NotificationService,
    private router: Router,
    private dialogBox: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) {
    this.fetchDocument();
  }

  ngOnInit(): void {
    this.fetchDocument();
  }

  fetchDocument() {
    this.loading = true;
    this.activatedRoute.paramMap.subscribe((params) => {
      const documentId = params.get('id');
      if (documentId) {
        this.noteService.getDocument(documentId).subscribe((document) => {
          this.document = document as EmployeeDocument;
          this.readOnly =
            document!.userId.toString() !== localStorage.getItem('userId');
          if (document?.keywords) {
            this.keywords = this.convertStringToArray(document.keywords)
          } else {
            this.keywords = [];
          }
          this.loading = false;
        });
      }
    });
  }

  convertStringToArray(inputString: string): string[] {
    // Remove the very outer quotes if they exist redundantly
    let cleanedString = inputString.trim();
    if (cleanedString[0] === '"' && cleanedString[cleanedString.length - 1] === '"') {
      cleanedString = cleanedString.substring(1, cleanedString.length - 1);
    }

    // Split the string by commas not within quotes
    return cleanedString.split(/","|(?<!"),(?=")/g).map(item =>
      item.replace(/^"|"$/g, '') // Remove leading and trailing quotes from each item
    );
  }

  changeDocumentName(event: Event): void {
    const input = event.target as HTMLElement;
    const inputText = input.innerText.trim();
    if (!inputText.length) {
      input.innerText = this.document.title;
      return;
    }
    if (this.document.title !== input.innerText) {
      this.document.title = input.innerText;
    }
  }

  updateDocument(): void {
    this.document.text = this.noteContent.nativeElement.innerHTML;
    this.document.userId = parseInt(this.userId || '-1');
    this.noteService.updateDocument(this.document).subscribe({
      next: (response: EmployeeDocument) => {
        this.notificationService.notify({
          message: 'Changes successfully saved! ',
          type: NotificationType.success,
        });
        this.fetchDocument();
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

  getUserInitials(): string {
    return this.document.userFirstname![0] + this.document.userLastname![0];
  }

  changeVisibility(): void {
    this.document.visibility = !this.document.visibility;
  }

  keywordsChanged(keywords: string[]): void {
    this.document.keywords = JSON.stringify(keywords).slice(1, -1);
  }

  uploadDocument() {
  }

  downloadDocument() {
  }

  goBack() {
    if (this.readOnly) {
      this.router.navigate(['/notes']);
    } else {
      const dialogResponse = this.dialogBox.open(
        ConfirmationDialogBoxComponent,
        {
          data: `Do you want to save the changes?`,
          disableClose: true,
          autoFocus: false,
        },
      );

      dialogResponse.afterClosed().subscribe((response) => {
        if (response) {
          this.updateDocument();
          this.router.navigate(['/notes']);
        } else {
          this.router.navigate(['/notes']);
        }
      });
    }
  }
}
