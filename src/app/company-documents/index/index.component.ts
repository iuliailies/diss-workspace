import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { PATHS } from '../../app.constants';
import { GetCompanyDocument } from '../../data-types/company-doc.model';
import { ErrorResponseModel } from '../../data-types/error-response.model';
import { NotificationType } from '../../data-types/notification.model';
import { CompanyDocService } from '../../services/company-doc.service';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';
import { NotificationService } from '../../services/notification.service';
import { UserType } from '../../data-types/user.model';
import {SearchDocument} from "../../data-types/search.model";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.sass',
})
export class IndexComponent implements OnInit {
  PATHS = PATHS;
  companyDocuments: GetCompanyDocument[] = [];
  userId = localStorage.getItem('userId');
  userType = localStorage.getItem('userType');
  loading = true;

  constructor(
    private companyDocumentService: CompanyDocService,
    private notificationService: NotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(() => {
      this.fetchCompanyDocuments();
    });
  }

  matchesUserId(companyDocumentUserId: number): boolean {
    return companyDocumentUserId.toString() === this.userId;
  }

  fetchCompanyDocuments(): void {
    this.loading = true;
    this.companyDocumentService.getCompanyDocuments().subscribe((documents) => {
      this.companyDocuments = documents;
      this.loading = false;
    });
  }

  triggerSearchCompanyDocuments(searchString: any) {
    searchString = searchString.trim();
    if (searchString !== null && searchString !== '')
      this.searchCompanyDocuments(searchString);
    else this.fetchCompanyDocuments();
  }

  searchCompanyDocuments(searchString: any): void {
    this.loading = true;
    const searchRequest: SearchDocument = {
      searchKey: searchString,
      userId: parseInt(this.userId || '-1'),
    };
    this.companyDocumentService.searchCompanyDocuments(searchRequest).subscribe((documents) => {
      this.companyDocuments = documents;
      this.loading = false;
    });
  }

  deleteCompanyDocument(event: any, document: GetCompanyDocument) {
    event.stopPropagation();
    const dialogResponse = this.confirmationDialogService.confirm(
      `Are you sure you want to delete document: ${document.title} ?`,
    );

    dialogResponse.subscribe((response) => {
      if (response) {
        this.companyDocumentService
          .deleteCompanyDocument(document.id)
          .subscribe({
            next: () => {
              this.fetchCompanyDocuments();
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

  getUserInitials(document: any): string {
    return document.user.firstname[0] + document.user.lastname[0];
  }

  getUserName(document: any): string {
    return document.user.firstname + ' ' + document.user.lastname;
  }

  viewCompanyDocument(id: any) {
    this.router.navigate([`company-docs/${id}`]);
  }

  isUserHR() {
    return this.userType === UserType.HR;
  }
}
