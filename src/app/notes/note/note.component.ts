import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EmployeeDocument } from '../../data-types/notes.model';
import { PATHS } from '../../app.constants';
import { NoteService } from '../../services/note.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationType } from '../../data-types/notification.model';
import { ErrorResponseModel } from '../../data-types/error-response.model';
import { NotificationService } from '../../services/notification.service';
import { File } from '../../data-types/file.model';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';
import { CanComponentDeactivate } from '../../core/unsaved-changes-guard.service';
import { Observable } from 'rxjs';
import {CommentService} from "../../services/comments.service";

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrl: './note.component.sass',
})
export class NoteComponent implements OnInit, CanComponentDeactivate {
  PATHS = PATHS;
  @ViewChild('noteContent') noteContent!: ElementRef;

  userId = localStorage.getItem('userId');
  documentId!: number;
  loading = false;
  readOnly = false;
  keywords: string[] = [];
  document: any;
  fileChanged = false;
  contentUpdated = false;
  commentsToggled = false;
  notInEditMode = true;

  constructor(
    private noteService: NoteService,
    private notificationService: NotificationService,
    private confirmationDialogService: ConfirmationDialogService,
    private activatedRoute: ActivatedRoute,
    private commentsService: CommentService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.get('id') !== null) {
        this.documentId = +params.get('id')!;
      }
    });
    this.fetchDocument();
  }

  fetchDocument() {
    this.loading = true;
    this.activatedRoute.paramMap.subscribe((params) => {
      if (this.documentId) {
        this.commentsService.getComments(this.documentId).subscribe((comments) => {
          this.commentsToggled = comments.length > 0;
          this.noteService.getDocument(this.documentId).subscribe((document) => {
            this.document = document as EmployeeDocument;
            this.notInEditMode = this.document.visibility !== false;
            this.initializeFields();
            this.loading = false;
          });
        });
      }
    });
  }

  initializeFields() {
    this.fileChanged = false;

    this.readOnly =
      this.document!.user.id.toString() !== localStorage.getItem('userId');

    if (this.document?.keywords) {
      this.keywords = this.convertStringToArray(this.document.keywords);
    } else {
      this.keywords = [];
    }

    this.contentUpdated = false;
  }

  convertStringToArray(inputString: string): string[] {
    // Remove the very outer quotes if they exist redundantly
    let cleanedString = inputString.trim();
    if (
      cleanedString[0] === '"' &&
      cleanedString[cleanedString.length - 1] === '"'
    ) {
      cleanedString = cleanedString.substring(1, cleanedString.length - 1);
    }

    // Split the string by commas not within quotes
    return cleanedString.split(/","|(?<!"),(?=")/g).map(
      (item) => item.replace(/^"|"$/g, ''), // Remove leading and trailing quotes from each item
    );
  }

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

  updateDocument(): void {
    this.loading = true;
    this.document.text = this.noteContent.nativeElement.innerHTML;
    this.document.userId = parseInt(this.userId || '-1');
    if (this.fileChanged && this.document.file) {
      this.document.file.buffer.arrayBuffer().then((buff: ArrayBuffer) => {
        const x = new Uint8Array(buff);
        this.document.file = {
          ...this.document.file,
          buffer: Array.from(x),
        };
        this.saveDocument();
      });
    } else {
      this.saveDocument();
    }
  }

  handleError(error: any) {
    if (error.error instanceof ErrorEvent) {
      this.notificationService.notify({
        message: 'An error occurred! Please try again later!',
        type: NotificationType.error,
      });
    } else {
      const errResponse: ErrorResponseModel = error.error as ErrorResponseModel;
      this.notificationService.notify({
        message: errResponse.errorMessage,
        type: NotificationType.error,
      });
    }
  }

  handleSuccess() {
    this.notificationService.notify({
      message: 'Changes successfully saved! ',
      type: NotificationType.success,
    });
    this.fetchDocument();
    this.contentUpdated = false;
    this.loading = false;
  }

  saveDocument(): void {
    this.noteService.updateDocument(this.document).subscribe({
      next: () => {
        this.handleSuccess();
      },
      error: (error: any) => {
        this.handleError(error);
        this.loading = false;
      },
    });
  }

  getUserInitials(): string {
    return this.document.user.firstname![0] + this.document.user.lastname![0];
  }

  getUserName(): string {
    return this.document.user.firstname! + ' ' + this.document.user.lastname!;
  }

  changeVisibility(): void {
    this.contentUpdated = true;
    this.document.visibility = !this.document.visibility;
  }

  keywordsChanged(keywords: string[]): void {
    this.contentUpdated = true;
    this.document.keywords = JSON.stringify(keywords).slice(1, -1);
  }

  downloadDocument() {
    const file = this.document.file;
    if (!this.fileChanged) {
      let binary_string = window.atob(file.buffer);

      let len = binary_string.length;
      let bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }

      const blob = new Blob([bytes.buffer], {
        type: `application/${file.type}`,
      });
      this.triggerDownload(blob, file.name);
    } else {
      const blob = new Blob([file.buffer], {
        type: `application/${file.type}`,
      });
      this.triggerDownload(blob, file.name);
    }
  }

  triggerDownload(blob: any, name: any) {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = name;
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  // Method to determine whether navigation can occur
  canDeactivate(): Observable<boolean> | boolean {
    const text = this.noteContent.nativeElement.innerHTML;

    // If there are no unsaved changes, allow navigation immediately
    if (!this.contentUpdated && this.document.text === text) {
      return true;
    }

    return this.confirmationDialogService.confirmNavigation();
  }

  removeFile() {
    this.contentUpdated = true;
    this.document.file = undefined;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.document.file = {
        ...this.document.file,
        buffer: file,
        name: file.name,
        type: file.type,
      };
      this.contentUpdated = true;
      this.fileChanged = true;
    }
  }

  isCommentsToggleVisible(): boolean {
    // TODO: recheck
    // return this.document.visibility || this.document.userId === this.userId;
    return this.document.visibility;
  }
}
