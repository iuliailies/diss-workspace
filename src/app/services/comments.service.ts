import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SaveComment, Comment, UpdateComment } from '../data-types/comments.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private baseUrl = 'http://localhost:8090/comments';

  constructor(private http: HttpClient) {}

  createComment(comment: SaveComment): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/create-comment`, comment);
  }

  getComments(documentId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/get-comments/${documentId}`);
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/get-comments/${id}`);
  }

  updateComment(comment: UpdateComment): Observable<Comment> {
    return this.http.put<Comment>(`${this.baseUrl}/update-comment`, comment);
  }
}
