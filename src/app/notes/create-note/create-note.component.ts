import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  EmployeeDocument,
  SaveEmployeeDocument,
} from '../../data-types/notes.model';
import { NoteService } from '../../services/note.service';
import { Router } from '@angular/router';
import { PATHS, noteTemplate } from '../../app.constants';
import { NotificationType } from '../../data-types/notification.model';
import { ErrorResponseModel } from '../../data-types/error-response.model';
import { NotificationService } from '../../services/notification.service';
import { File } from '../../data-types/file.model';
import { CanComponentDeactivate } from '../../core/unsaved-changes-guard.service';
import { Observable } from 'rxjs';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrl: './create-note.component.sass',
})
export class CreateNoteComponent implements CanComponentDeactivate {
  @ViewChild('noteContent') noteContent!: ElementRef;

  protected readonly PATHS = PATHS;
  noteTemplate = noteTemplate;
  userId = parseInt(localStorage.getItem('userId') || '-1');
  userFirstname = localStorage.getItem('userFirstname') || '';
  userLastname = localStorage.getItem('userLastname') || '';
  loading = false;
  fileType: any;
  fileName: any;
  file: any;
  contentUpdated = false;

  textNoteContent = '';

  document: SaveEmployeeDocument = {
    title: 'New document',
    text: '',
    file: undefined,
    keywords: '',
    userId: 16,
    visibility: false,
  };

  constructor(
    private noteService: NoteService,
    private router: Router,
    private notificationService: NotificationService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {}

  changeDocumentName(event: Event): void {
    this.contentUpdated = true;
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
  handleError(error: any) {
    const defaultMessage = 'An error occurred! Please try again later!';
    if (error.error instanceof ErrorEvent) {
      this.notificationService.notify({
        message: defaultMessage,
        type: NotificationType.error,
      });
    } else {
      const errResponse: ErrorResponseModel = error.error as ErrorResponseModel;
      this.notificationService.notify({
        message: errResponse.errorMessage || defaultMessage,
        type: NotificationType.error,
      });
    }
  }

  handleSuccess(response: EmployeeDocument) {
    this.notificationService.notify({
      message: 'Document saved successfully! ',
      type: NotificationType.success,
    });
    this.contentUpdated = false;
    this.loading = false;
    this.navigateToNoteView(response);
  }

  saveDocument(): void {
    this.noteService.createNote(this.document).subscribe({
      next: (response: EmployeeDocument) => {
        this.handleSuccess(response);
      },
      error: (error: any) => {
        this.handleError(error);
        this.loading = false;
      },
    });
  }

  createDocument() {
    this.textNoteContent = this.noteContent.nativeElement.innerHTML;
    this.document.text = this.textNoteContent;
    this.document.userId = this.userId;

    if (this.file) {
      //there is a file
      this.file.arrayBuffer().then((buff: ArrayBuffer) => {
        this.loading = true;
        const x = new Uint8Array(buff);
        this.document.file = {
          name: this.fileName,
          type: this.fileType,
          buffer: Array.from(x),
        };
        this.saveDocument();
      });
    } else {
      this.document.file = undefined;
      this.saveDocument();
    }
  }

  navigateToNoteView(document: any): void {
    this.router.navigate([`notes/${document.id}`]);
  }

  // Method to determine whether navigation can occur
  canDeactivate(): Observable<boolean> | boolean {
    // If there are no unsaved changes, allow navigation immediately
    if (!this.contentUpdated && this.document.text === this.textNoteContent) {
      console.log('merge pe navigation imediat');
      return true;
    }

    return this.confirmationDialogService.confirmNavigation();
  }

  changeVisibility(): void {
    this.contentUpdated = true;
    this.document.visibility = !this.document.visibility;
  }

  keywordsChanged(keywords: string[]): void {
    this.contentUpdated = true;
    this.document.keywords = JSON.stringify(keywords).slice(1, -1);
  }

  downloadDocument(event: any) {
    event.preventDefault();
    const blob = new Blob([this.file], {
      type: `application/${this.fileType}`,
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = this.fileName;
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.contentUpdated = true;
      this.fileType = file.type;
      this.fileName = file.name;
      this.file = file;
    }
  }

  removeFile() {
    this.contentUpdated = true;
    this.file = null;
    this.fileName = null;
  }

  getUserInitials(): string {
    return this.userFirstname[0] + this.userLastname[0];
  }

  getUserName(): string {
    return this.userFirstname + ' ' + this.userLastname;
  }
}
