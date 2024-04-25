import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  EmployeeDocument,
  SaveEmployeeDocument,
} from '../../data-types/notes.model';
import { NoteService } from '../../services/note.service';
import { Router } from '@angular/router';
import { PATHS } from '../../app.constants';
import { NotificationType } from '../../data-types/notification.model';
import { ErrorResponseModel } from '../../data-types/error-response.model';
import { NotificationService } from '../../services/notification.service';
import { File } from '../../data-types/file.model';

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
  document: SaveEmployeeDocument = {
    title: 'New document',
    text: '',
    file: undefined,
    keywords: '',
    userId: 16,
    visibility: false,
  };
  fileType: any;
  fileName: any;
  file: any;

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

  createDocument() {
    this.document.text = this.noteContent.nativeElement.innerHTML;
    this.document.userId = parseInt(this.userId || '-1');
    if (this.file) {
      //there is a file
      this.file.arrayBuffer().then((buff: ArrayBuffer) => {
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

  changeVisibility(): void {
    this.document.visibility = !this.document.visibility;
  }

  keywordsChanged(keywords: string[]): void {
    this.document.keywords = JSON.stringify(keywords).slice(1, -1);
  }

  downloadDocument() {
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
      this.fileType = file.type;
      this.fileName = file.name;
      this.file = file;
    }
  }

  removeFile() {
    this.file = null;
    this.fileName = null;
  }
}
