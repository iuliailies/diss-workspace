import {Component, OnInit} from '@angular/core';
import { PATHS } from '../../app.constants';
import { GetEmployeeDocument } from '../../data-types/notes.model';
import { NoteService } from '../../services/note.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { ConfirmationDialogBoxComponent } from '../../core/confirmation-dialog-box/confirmation-dialog-box.component';
import { NotificationType } from '../../data-types/notification.model';
import { ErrorResponseModel } from '../../data-types/error-response.model';
import {Badge} from "../../data-types/badge.model";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.sass',
})
export class IndexComponent implements OnInit{
  protected readonly PATHS = PATHS;
  documents: GetEmployeeDocument[] = [];
  badges: Badge[] = [];
  displayedBadges: Badge[] = [];
  startIndex = 0;
  endIndex = 10;
  pageSize = 10;
  xpUntilNextLevel = 0;
  loading = true;

  userEmail = localStorage.getItem('userEmail') || '';
  userFirstname = localStorage.getItem('userFirstname') || '';
  userLastname = localStorage.getItem('userLastname') || '';
  userPoints = parseInt(localStorage.getItem('userPoints') || '-1');
  userLevel = parseInt(localStorage.getItem('userLevel') || '-1');
  userId = parseInt(localStorage.getItem('userId') || '-1');

  constructor(
    private noteService: NoteService,
    private userService: UserService,
    private dialogBox: MatDialog,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.fetchDocuments();
  }

  fetchDocuments(): void {
    this.loading = true;
    this.noteService.getOwnDocuments(this.userId).subscribe((documents) => {
      this.documents = documents;
      this.xpUntilNextLevel = 200 - this.userPoints;
      this.userService.getUserBadges(this.userId).subscribe((badges) => {
        this.badges = badges;
        this.displayedBadges = this.badges.slice(this.startIndex, this.endIndex)
        this.loading = false;
      });
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

  getUserInitials(): string {
    return this.userFirstname[0] + this.userLastname[0];
  }

  viewDocument(id: any) {
    this.router.navigate([`notes/${id}`]);
  }

  previous(){
    if(this.startIndex >= this.pageSize) {
      this.startIndex = this.startIndex - this.pageSize;
      this.endIndex = this.endIndex - this.pageSize;
      this.displayedBadges = this.badges.slice(this.startIndex, this.endIndex)
    }
  }

  next(){
    if(this.startIndex + this.pageSize <= this.badges.length){
      this.endIndex = this.endIndex + this.pageSize;
      this.startIndex = this.startIndex + this.pageSize;
      this.displayedBadges = this.badges.slice(this.startIndex, this.endIndex)
    }
  }
}
