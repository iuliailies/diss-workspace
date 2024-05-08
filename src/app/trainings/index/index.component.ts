import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogBoxComponent } from '../../core/confirmation-dialog-box/confirmation-dialog-box.component';
import { NotificationType } from '../../data-types/notification.model';
import { ErrorResponseModel } from '../../data-types/error-response.model';
import { PATHS } from '../../app.constants';
import { GetTrainingDocument } from '../../data-types/training.model';
import { TrainingService } from '../../services/training.service';
import { UserType } from '../../data-types/user.model';
import { Badge } from '../../data-types/badge.model';
import {forkJoin, Subscription} from "rxjs";
import {ConfirmationDialogService} from "../../services/confirmation-dialog.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.sass',
})
export class IndexComponent implements OnInit {
  protected readonly PATHS = PATHS;
  completedTrainings: GetTrainingDocument[] = [];
  todoTrainings: GetTrainingDocument[] = [];
  userId = localStorage.getItem('userId');
  userLevel = parseInt(localStorage.getItem('userLevel')!);
  userType = localStorage.getItem('userType');
  expandedTrainingId: number | null = null;
  isToDoOpen = true;
  isCompletedOpen = false;
  loading = true;
  subscription!: Subscription;

  constructor(
    private trainingService: TrainingService,
    private confirmationDialogService: ConfirmationDialogService,
    private notificationService: NotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  isUserTrainer() {
    return this.userType === UserType.TRAINER;
  }

  toggleDetails(trainingId: number) {
    if (this.expandedTrainingId === trainingId) {
      this.expandedTrainingId = null;
    } else {
      this.expandedTrainingId = trainingId;
    }
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe(() => {
      this.fetchAllTrainings();
    });
  }

  fetchAllTrainings() {
    this.subscription = forkJoin([
      this.trainingService.getTodoTrainings(this.userId),
      this.trainingService.getCompletedTrainings(this.userId)
    ]).subscribe({
      next: ([todoResponse, completedResponse]) => {
        this.todoTrainings = todoResponse;
        this.completedTrainings = completedResponse;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      },
      complete: () => {
      }
    });
  }

  hasEnoughLevel(requiredLevel: number): boolean {
    return this.userLevel >= requiredLevel;
  }

  fetchTodoTrainings() {
    this.loading = true;
    this.trainingService
      .getTodoTrainings(this.userId)
      .subscribe((trainings) => {
        this.todoTrainings = trainings;
        this.loading = false;
      });
  }

  fetchCompletedTrainings() {
    this.loading = true;
    this.trainingService
      .getCompletedTrainings(this.userId)
      .subscribe((trainings) => {
        this.completedTrainings = trainings;
        this.loading = false;
      });
  }

  matchesUserIdAndIsTrainer(trainingUserId: number): boolean {
    return trainingUserId.toString() === this.userId && this.userType === UserType.TRAINER;
  }

  deleteTraining(event: any, training: GetTrainingDocument) {
    event.stopPropagation();

    const dialogResponse = this.confirmationDialogService.confirm(`Are you sure you want to delete document: ${document.title} ?`);

    dialogResponse.subscribe((response) => {
      if (response) {
        this.trainingService.deleteTraining(training.id).subscribe({
          next: () => {
            this.fetchCompletedTrainings();
            this.fetchTodoTrainings();
            this.notificationService.notify({
              message: 'Training deleted successfully!',
              type: NotificationType.error,
            });
          },
          error: (error: any) => {
            this.handleError(error);
          },
        });
      }
    });
  }

  startTraining(training: any, event: any) {
    event.stopPropagation();
    const badge: Badge = {
      userId: parseInt(this.userId || '-1'),
      trainingId: training.id,
      name: training.title,
    };
    this.trainingService.updateBadge(badge).subscribe({
      next: () => {
        this.router.navigate([`trainings/${training.id}`]);
      },
      error: (error: any) => {
        this.handleError(error);
      },
    });
  }

  viewTraining(id: any) {
    this.router.navigate([`trainings/${id}`]);
  }

  handleError(error: any) {
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
  }

}
