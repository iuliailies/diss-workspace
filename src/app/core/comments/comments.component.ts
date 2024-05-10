import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommentService } from '../../services/comments.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { PATHS } from '../../app.constants';
import { Comment, SaveComment } from '../../data-types/comments.model';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.sass'
})
export class CommentsComponent implements OnInit {
  PATHS = PATHS;

  @Input('documentId') documentId!: number;
  @ViewChild('commentContent') commentContent!: ElementRef;
  
  comments: Comment[] = [];
  userId = localStorage.getItem('userId');
  loading = true;

  constructor(
    private commentsService: CommentService,
    private dialogBox: MatDialog,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.fetchComments()
  }

  fetchComments(): void {
    this.loading = true;
    this.commentsService.getComments(this.documentId).subscribe((comments) => {
      this.comments = comments;
      console.log("ccc", comments)
      this.loading = false;
    });
  }

  addComment(): void {
    const commentText = this.commentContent.nativeElement.innerHTML
    if(!commentText.length) return;
    const saveCommentData: SaveComment = {
      documentId: this.documentId,
      text: commentText,
      userId: parseInt(this.userId || '-1')
  }
    this.commentsService.createComment(saveCommentData).subscribe((comment) => {
      this.comments.unshift(comment);
      this.commentContent.nativeElement.innerHTML = ''
    })
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
