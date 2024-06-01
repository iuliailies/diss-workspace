import { Component, OnInit } from '@angular/core';
import { PATHS } from '../../app.constants';
import { GetEmployeeDocument } from '../../data-types/notes.model';
import { NoteService } from '../../services/note.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { ConfirmationDialogBoxComponent } from '../../core/confirmation-dialog-box/confirmation-dialog-box.component';
import { NotificationType } from '../../data-types/notification.model';
import { ErrorResponseModel } from '../../data-types/error-response.model';
import { Badge } from '../../data-types/badge.model';
import { UserService } from '../../services/user.service';
import { forkJoin, map } from 'rxjs';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';
import { SearchDocument } from '../../data-types/search.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.sass',
})
export class IndexComponent implements OnInit {
  protected readonly PATHS = PATHS;
  documents: GetEmployeeDocument[] = [];
  badges: Badge[] = [];
  displayedBadges: Badge[] = [];
  startIndex = 0;
  endIndex = 10;
  pageSize = 10;
  xpUntilNextLevel = 0;
  loading = true;
  existBadges = false;
  loadingDocuments = false;

  userEmail = localStorage.getItem('userEmail') || '';
  userFirstname = localStorage.getItem('userFirstname') || '';
  userLastname = localStorage.getItem('userLastname') || '';
  userPoints = parseInt(localStorage.getItem('userPoints') || '-1');
  userLevel = parseInt(localStorage.getItem('userLevel') || '-1');
  userId = parseInt(localStorage.getItem('userId') || '-1');

  displayLeftArrow = false;
  displayRightArrow = false;

  constructor(
    private noteService: NoteService,
    private userService: UserService,
    private notificationService: NotificationService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchDocumentsAndBadges();
  }

  triggerSearchDocuments(searchString: any): void {
    searchString = searchString.trim();
    if (searchString !== null && searchString !== '')
      this.searchDocuments(searchString);
    else this.fetchDocuments();
  }

  searchDocuments(searchString: any): void {
    this.loading = true;
    const searchRequest: SearchDocument = {
      searchKey: searchString,
      userId: this.userId,
    };
    this.noteService
      .searchOwnedDocuments(searchRequest)
      .subscribe((documents) => {
        this.documents = documents;
        this.loading = false;
      });
  }

  fetchDocumentsAndBadges(): void {
    this.loading = true;

    const documents$ = this.noteService.getOwnDocuments(this.userId);
    const badges$ = this.userService.getUserBadges(this.userId);

    forkJoin([documents$, badges$])
      .pipe(
        map(([documents, badges]) => {
          return {
            documents,
            badges,
          };
        }),
      )
      .subscribe({
        next: ({ documents, badges }) => {
          this.documents = documents;
          this.xpUntilNextLevel = 200 - this.userPoints;
          this.badges = badges;
          this.displayedBadges = this.badges.slice(
            this.startIndex,
            this.endIndex,
          );
          this.existBadges = this.badges.length > 0;
          if(this.badges.length <= 10) {
            this.displayLeftArrow = false;
            this.displayRightArrow = false;
          } else {
            this.displayLeftArrow = false;
            this.displayRightArrow = true;
          }
          this.loading = false;
        },
        error: (error) => {
          this.handleError(error);
        },
      });
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

  fetchDocuments(): void {
    this.loadingDocuments = true;
    this.noteService.getOwnDocuments(this.userId).subscribe((documents) => {
      this.documents = documents;
      this.loadingDocuments = false;
    });
  }

  deleteDocument(event: any, document: GetEmployeeDocument) {
    event.stopPropagation();

    const dialogResponse = this.confirmationDialogService.confirm(
      `Are you sure you want to delete document: ${document.title} ? <br> This action cannot be reverted!`,
    );

    dialogResponse.subscribe((response) => {
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
            this.handleError(error);
          },
        });
      }
    });
  }

  getUserInitials(): string {
    return this.userFirstname[0] + this.userLastname[0];
  }

  viewDocument(id: any) {
    this.router.navigate([`notes/${id}`]);
  }

  previous() {

    if(this.startIndex - this.pageSize >= this.pageSize) {
      this.displayLeftArrow = true;
      this.displayRightArrow = true;
    } else {
      this.displayLeftArrow = false;
      this.displayRightArrow = true;
    }

    if (this.startIndex >= this.pageSize) {
      this.startIndex = this.startIndex - this.pageSize;
      this.endIndex = this.endIndex - this.pageSize;
      this.displayedBadges = this.badges.slice(this.startIndex, this.endIndex);
    } else
      this.displayLeftArrow = false;
      this.displayRightArrow = true;
  }

  next() {

    if(this.startIndex + this.pageSize * 2 <= this.badges.length) {
      this.displayLeftArrow = true;
      this.displayRightArrow = true;
    } else {
      this.displayLeftArrow = true;
      this.displayRightArrow = false;
    }

    if (this.startIndex + this.pageSize <= this.badges.length) {
      this.endIndex = this.endIndex + this.pageSize;
      this.startIndex = this.startIndex + this.pageSize;
      this.displayedBadges = this.badges.slice(this.startIndex, this.endIndex);
    } else {
      this.displayLeftArrow = true;
      this.displayRightArrow = false;
    }
  }
}
