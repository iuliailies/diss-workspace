import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateDocumentRequest, Document, newDocumentData } from '../notes/notes.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private requestURL = 'http://localhost:8090/employee-document';

  constructor(private http: HttpClient) { }

  createNote(note: Document): Observable<Document> {
    const documentToSend: CreateDocumentRequest = newDocumentData(note)
    return this.http.post<Document>(this.requestURL + '/create-document', documentToSend);
  }
}
