import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  SaveEmployeeDocument,
  EmployeeDocument,
  GetEmployeeDocument,
} from '../data-types/notes.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private requestURL = 'http://localhost:8090/employee-document';

  constructor(private http: HttpClient) {}

  createNote(note: SaveEmployeeDocument): Observable<EmployeeDocument> {
    return this.http.post<EmployeeDocument>(
      this.requestURL + '/create-document',
      note,
    );
  }

  getDocuments(): Observable<GetEmployeeDocument[]> {
    return this.http.get<GetEmployeeDocument[]>(
      `${this.requestURL}/get-documents/${localStorage.getItem('userId')}`,
    );
  }

  getOwnDocuments(id: any): Observable<GetEmployeeDocument[]> {
    return this.http.get<GetEmployeeDocument[]>(
      `${this.requestURL}/get-own-documents/${id}`,
    );
  }

  deleteDocument(id: any): Observable<any> {
    return this.http.delete(`${this.requestURL}/${id}`);
  }

  getDocument(id: any): Observable<EmployeeDocument> {
    return this.http.get<EmployeeDocument>(
      `${this.requestURL}/get-document/${id}`,
    );
  }

  updateDocument(document: EmployeeDocument): Observable<EmployeeDocument> {
    return this.http.put<EmployeeDocument>(
      `${this.requestURL}/update-document`,
      document,
    );
  }

  searchDocuments(searchRequest: any) : Observable<any>
  {
    return this.http.post<GetEmployeeDocument[]>(`${this.requestURL}/search-documents`, searchRequest);
  }
}
