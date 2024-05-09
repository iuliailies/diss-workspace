import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PATHS } from '../../app.constants';
import { CanComponentDeactivate } from '../../core/unsaved-changes-guard.service';
import {
  CompanyDocument,
  SaveCompanyDocument,
} from '../../data-types/company-doc.model';
import { ErrorResponseModel } from '../../data-types/error-response.model';
import { NotificationType } from '../../data-types/notification.model';
import { CompanyDocService } from '../../services/company-doc.service';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-create-document',
  templateUrl: './create-document.component.html',
  styleUrl: './create-document.component.sass',
})
export class CreateDocumentComponent implements CanComponentDeactivate {
  @ViewChild('documentContent') documentContent!: ElementRef;

  protected readonly PATHS = PATHS;
  userId = parseInt(localStorage.getItem('userId') || '-1');
  userFirstname = localStorage.getItem('userFirstname') || '';
  userLastname = localStorage.getItem('userLastname') || '';
  loading = false;
  fileType: any;
  fileName: any;
  file: any;
  contentUpdated = false;

  document: SaveCompanyDocument = {
    title: 'New document',
    text: '',
    file: undefined,
    keywords: '',
    userId: 16,
  };

  constructor(
    private documentService: CompanyDocService,
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

  handleSuccess(response: CompanyDocument) {
    this.notificationService.notify({
      message: 'Document saved successfully! ',
      type: NotificationType.success,
    });
    this.contentUpdated = false;
    this.loading = false;

    this.navigateToDocumentView(response);
  }

  saveDocument(): void {
    this.documentService.createDocument(this.document).subscribe({
      next: (response: CompanyDocument) => {
        this.handleSuccess(response);
      },
      error: (error: any) => {
        this.handleError(error);
        this.loading = false;
      },
    });
  }

  createDocument() {
    this.document.text = this.documentContent.nativeElement.innerHTML;
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

  navigateToDocumentView(document: any): void {
    this.router.navigate([`company-docs/${document.id}`]);
  }

  // Method to determine whether navigation can occur
  canDeactivate(): Observable<boolean> | boolean {
    const text = this.documentContent.nativeElement.innerHTML;

    // If there are no unsaved changes, allow navigation immediately
    if (!this.contentUpdated && this.document.text === text) {
      return true;
    }

    return this.confirmationDialogService.confirmNavigation();
  }

  keywordsChanged(keywords: string[]): void {
    this.contentUpdated = true;
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
