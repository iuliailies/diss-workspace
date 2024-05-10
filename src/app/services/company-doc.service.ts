import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CompanyDocument,
  GetCompanyDocument,
  SaveCompanyDocument,
} from '../data-types/company-doc.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyDocService {
  private requestURL = 'http://localhost:8090/company-document';

  constructor(private http: HttpClient) {}

  createCompanyDocument(
    note: SaveCompanyDocument,
  ): Observable<CompanyDocument> {
    return this.http.post<CompanyDocument>(
      this.requestURL + '/create-document',
      note,
    );
  }

  getCompanyDocuments(): Observable<GetCompanyDocument[]> {
    return this.http.get<GetCompanyDocument[]>(
      `${this.requestURL}/get-documents`,
    );
  }

  deleteCompanyDocument(id: any): Observable<any> {
    return this.http.delete(`${this.requestURL}/${id}`);
  }

  getCompanyDocument(id: any): Observable<CompanyDocument> {
    return this.http.get<CompanyDocument>(
      `${this.requestURL}/get-document/${id}`,
    );
  }

  updateCompanyDocument(
    document: CompanyDocument,
  ): Observable<CompanyDocument> {
    return this.http.put<CompanyDocument>(
      `${this.requestURL}/update-document`,
      document,
    );
  }
}
