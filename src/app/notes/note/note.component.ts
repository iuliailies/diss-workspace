import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EmployeeDocument } from '../../data-types/notes.model';
import { PATHS } from '../../app.constants';
import { NoteService } from '../../services/note.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from '../../data-types/notification.model';
import { ErrorResponseModel } from '../../data-types/error-response.model';
import { NotificationService } from '../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogBoxComponent } from '../../core/confirmation-dialog-box/confirmation-dialog-box.component';
import { File } from '../../data-types/file.model';

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
  keywords: string[] = [];
  document: any;
  fileChanged = false;

  constructor(
    private noteService: NoteService,
    private notificationService: NotificationService,
    private router: Router,
    private dialogBox: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) {}

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
          this.initializeFields();
          this.loading = false;
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
    //TODO find a way to take the noteContent when the text box is changed so that we can track if a change was made after
    // the document was saved and if there were no changes made and he clicks on a menu button, to not ask him to save the document

    //TODO also find a way when a menu button is pressed, to display the pop up for saving the changes
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

  saveDocument(): void {
    this.noteService.updateDocument(this.document).subscribe({
      next: () => {
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
    return this.document.user.firstname![0] + this.document.user.lastname![0];
  }

  getUserName(): string {
    return this.document.user.firstname! + ' ' + this.document.user.lastname!;
  }

  changeVisibility(): void {
    this.document.visibility = !this.document.visibility;
  }

  keywordsChanged(keywords: string[]): void {
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
        }
        this.router.navigate(['/notes']);
      });
    }
  }

  removeFile() {
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
      this.fileChanged = true;
    }
  }
}
