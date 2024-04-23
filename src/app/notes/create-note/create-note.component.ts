import { Component, ElementRef, ViewChild } from '@angular/core';
import { EmployeeDocument } from '../../data-types/notes.model';
import { NoteService } from '../../services/note.service';
import { Router } from '@angular/router';
import { PATHS } from '../../app.constants';
import { NotificationType } from '../../data-types/notification.model';
import { ErrorResponseModel } from '../../data-types/error-response.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrl: './create-note.component.sass',
})
export class CreateNoteComponent {
  @ViewChild('noteContent') noteContent!: ElementRef;

  protected readonly PATHS = PATHS;
  userId = localStorage.getItem('userId');
  userInitials = localStorage.getItem('userInitials');
  loading = false;
  document: EmployeeDocument = {
    title: 'New document',
    text: '',
    document: undefined,
    keywords: '',
    lastModified: undefined,
    userId: 16,
    comments: [],
    visibility: false,
  };

  constructor(
    private noteService: NoteService,
    private router: Router,
    private notificationService: NotificationService,
  ) {}

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

  saveDocument(): void {
    this.document.text = this.noteContent.nativeElement.innerHTML;
    this.document.userId = parseInt(this.userId || '-1');
    this.noteService.createNote(this.document).subscribe({
      next: (response: EmployeeDocument) => {
        this.notificationService.notify({
          message: 'Document saved successfully! ',
          type: NotificationType.success,
        });
        this.navigateToNoteView(response);
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

  navigateToNoteView(document: any): void {
    this.router.navigate([`notes/${document.id}`]);
  }

  changeVisibility(): void {
    this.document.visibility = !this.document.visibility;
  }

  keywordsChanged(keywords: string[]): void {
    this.document.keywords = JSON.stringify(keywords).slice(1, -1);
  }

  uploadDocument() {}

  downloadDocument() {}
}
