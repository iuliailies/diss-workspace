import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Document } from './notes.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private requestURL = 'http://localhost:8090/employee-document';

  constructor(private http: HttpClient) { }

  createNote(note: Document): Observable<Document> {
    const headers = new HttpHeaders({
      'Authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJlbWFpbCI6ImFsaW5hQGdtYWlsLmNvbSIsInR5cGUiOiJFTVBMT1lFRSIsImlkIjoxLCJleHAiOjE3MTM3MTgwMDB9.NfuGNhzWzKmxDDrM5ObgaOz2q98EOp7nXtPM0gphXL6bk2QT4Z8tN3_UhF9sR7UhhUeaTUthuDSGxSmca4hDtw'
    });
    return this.http.post<Document>(this.requestURL + '/create-document',note, {headers});
  }
}
