import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../../services/training.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingDocument } from '../../data-types/training.model';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { PATHS } from '../../app.constants';
import { NotificationService } from '../../services/notification.service';
import { NotificationType } from '../../data-types/notification.model';
import { Badge } from '../../data-types/badge.model';
import { ErrorResponseModel } from '../../data-types/error-response.model';
import { UserProgressUpdate } from '../../data-types/user.model';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrl: './training.component.sass',
})
export class TrainingComponent implements OnInit {
  protected readonly PATHS = PATHS;
  training: any;

  pdfSrc = '';
  totalPages: number = 0;
  currentPage: number = 1;
  loading = false;

  userId: any;
  userPoints: any;
  userLevel: any;

  progressStatus: string = 'In progress';
  readOnly = false;
  newLevelUnlocked = false;
  newLevel = 0;
  xpToNextLevel = 0;

  constructor(
    private trainingService: TrainingService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.initializeVariables();
    this.fetchTraining();
  }

  initializeVariables() {
    this.userId = parseInt(localStorage.getItem('userId') || '-1');
    this.userPoints = parseInt(localStorage.getItem('userPoints') || '-1');
    this.userLevel = parseInt(localStorage.getItem('userLevel') || '-1');
    this.newLevel = this.userLevel + 1;
  }

  fetchTraining() {
    this.loading = true;
    this.activatedRoute.paramMap.subscribe((params) => {
      const trainingId = params.get('id');
      if (trainingId) {
        this.trainingService
          .getTraining({ trainingId: trainingId, userId: this.userId })
          .subscribe((training) => {
            this.training = training as TrainingDocument;
            this.initializeFields();
            this.loading = false;
          });
      }
    });
  }

  isCompleted() {
    return this.progressStatus === 'Completed';
  }

  isFinished() {
    return this.currentPage === this.totalPages;
  }

  initializeFields() {
    this.currentPage = this.training.badge.currentPage;
    if (this.training.badge.progressStatus === 'Completed') {
      this.currentPage = 1;
      this.readOnly = true;
    }
    this.readDocument();
  }

  goBack() {
    if (this.isCompleted() || this.readOnly) {
      this.router.navigate(['trainings']);
    } else {
      this.updateTrainingProgress();
    }
  }

  updateTrainingProgress() {
    const badge: Badge = {
      trainingId: this.training.id,
      userId: this.userId,
      currentPage: this.currentPage,
      progressStatus: this.progressStatus,
      name: this.training.name,
    };

    this.trainingService.updateBadge(badge).subscribe({
      next: () => {
        if (badge.progressStatus === 'In progress') {
          this.notificationService.notify({
            message: 'Progress saved successfully',
            type: NotificationType.success,
          });
          this.router.navigate(['trainings']);
        } else {
          this.updateUserProgress();
        }
      },
      error: (error) => {
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

  updateUserProgress() {
    const user: UserProgressUpdate = {
      id: parseInt(this.userId || '-1'),
      points: this.userPoints,
      level: this.userLevel,
    };

    this.trainingService.updateUserProgress(user).subscribe({
      next: () => {},
      error: (error) => {
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

  readDocument() {
    if (typeof FileReader !== 'undefined') {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
      };

      let binary_string = window.atob(this.training.file.buffer);

      let len = binary_string.length;
      let bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      const blob = new Blob([bytes.buffer], { type: `application/pdf` });
      reader.readAsArrayBuffer(blob);
    }
  }

  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.totalPages = pdf.numPages;
  }

  public previous() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  public next() {
    if (this.totalPages > this.currentPage) {
      this.currentPage++;
    }
  }

  finish() {
    this.progressStatus = 'Completed';
    if (this.userPoints + this.training.reward >= 200) {
      this.userPoints = this.userPoints + this.training.reward - 200;
      this.newLevelUnlocked = true;
      this.userLevel = this.userLevel + 1;
    } else {
      this.newLevelUnlocked = false;
      this.userPoints = this.userPoints + this.training.reward;
      this.xpToNextLevel = 200 - this.userPoints;
    }
    this.updateTrainingProgress();
    this.setLocalStorageVariables();
  }

  setLocalStorageVariables() {
    localStorage.setItem('userPoints', String(this.userPoints));
    localStorage.setItem('userLevel', String(this.userLevel));
  }
}
