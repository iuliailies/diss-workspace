import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyDocument, GetCompanyDocument, SaveCompanyDocument } from '../data-types/company-doc.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyDocService {
  private requestURL = 'http://localhost:8090/company-document';

  constructor(private http: HttpClient) {}

  createDocument(note: SaveCompanyDocument): Observable<CompanyDocument> {
    return this.http.post<CompanyDocument>(
      this.requestURL + '/create-document',
      note,
    );
  }

  getDocuments(): Observable<GetCompanyDocument[]> {
    return this.http.get<GetCompanyDocument[]>(
      `${this.requestURL}/get-documents`,
    );
  }

  deleteDocument(id: any): Observable<any> {
    return this.http.delete(`${this.requestURL}/${id}`);
  }

  getDocument(id: any): Observable<CompanyDocument> {
    return this.http.get<CompanyDocument>(
      `${this.requestURL}/get-document/${id}`,
    );
  }

  updateDocument(document: CompanyDocument): Observable<CompanyDocument> {
    return this.http.put<CompanyDocument>(
      `${this.requestURL}/update-document`,
      document,
    );
  }
}
