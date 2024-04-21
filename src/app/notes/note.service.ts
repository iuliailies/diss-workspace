import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Document } from './notes.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private requestURL = 'notes/';

  constructor(private http: HttpClient) { }

  createNote(note: Document): void {

  }
}
