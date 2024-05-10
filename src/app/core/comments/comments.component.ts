import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommentService } from '../../services/comments.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { PATHS } from '../../app.constants';
import { Comment, SaveComment } from '../../data-types/comments.model';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';
import { NotificationType } from '../../data-types/notification.model';
import { ErrorResponseModel } from '../../data-types/error-response.model';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.sass',
})
export class CommentsComponent implements OnInit {
  PATHS = PATHS;

  @Input('documentId') documentId!: number;
  @ViewChild('commentContent') commentContent!: ElementRef;
  @ViewChild('commentText') commentUpdateText!: ElementRef;

  comments: Comment[] = [];
  userId = localStorage.getItem('userId');
  loading = true;
  commentIndexEdit = -1;

  constructor(
    private commentsService: CommentService,
    private dialogBox: MatDialog,
    private notificationService: NotificationService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {}

  ngOnInit(): void {
    this.fetchComments();
  }

  fetchComments(): void {
    this.loading = true;
    this.commentsService.getComments(this.documentId).subscribe((comments) => {
      this.comments = comments;
      this.loading = false;
    });
  }

  addComment(): void {
    const commentText = this.commentContent.nativeElement.innerHTML;
    if (!commentText.length) return;
    const saveCommentData: SaveComment = {
      documentId: this.documentId,
      text: commentText,
      userId: parseInt(this.userId || '-1'),
    };
    this.commentsService.createComment(saveCommentData).subscribe(
      (comment) => {
        this.comments.unshift(comment);
        this.commentContent.nativeElement.innerHTML = '';
        this.notificationService.notify({
          message: 'Comment added successfully!',
          type: NotificationType.success,
        });
      },
      (error) => {
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
    );
  }

  updateComment(comment: Comment): void {
    const newText = this.commentUpdateText.nativeElement.innerHTML;
    if (comment.text === newText || !newText.length) {
      this.commentIndexEdit = -1;
      return;
    }
    comment.text = this.commentUpdateText.nativeElement.innerHTML;
    this.commentsService.updateComment(comment).subscribe(
      () => {
        this.notificationService.notify({
          message: 'Comment updated successfully!',
          type: NotificationType.success,
        });
        this.commentIndexEdit = -1;
      },
      (error) => {
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
    );
  }

  deleteComment(comment: Comment, index: number): void {
    const dialogResponse = this.confirmationDialogService.confirm(
      `Are you sure you want to delete the comment?`,
    );

    dialogResponse.subscribe((response) => {
      if (response) {
        this.commentsService.deleteComment(comment.id).subscribe({
          next: () => {
            this.comments.splice(index, 1);
            this.commentIndexEdit = -1;
            this.notificationService.notify({
              message: 'Comment deleted successfully!',
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

  isCommentEditable(comment: Comment): boolean {
    return (
      comment.user.id === parseInt(this.userId || '-1') &&
      this.commentIndexEdit === -1
    );
  }

  replaceText(text: string) {
    return text.replace(/&nbsp;/g, ' ').replace(/<br>/g, '\n');
  }

  getUserName(comment: Comment): string {
    return comment.user.firstname! + ' ' + comment.user.lastname!;
  }

  getUserInitials(comment: Comment): string {
    return comment.user.firstname![0] + comment.user.lastname![0];
  }
}
