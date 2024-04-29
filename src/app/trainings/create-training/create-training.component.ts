import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PATHS} from "../../app.constants";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {CookieService} from "ngx-cookie-service";
import {File} from "../../data-types/file.model";
import {NotificationService} from "../../services/notification.service";
import {NotificationType} from "../../data-types/notification.model";
import {SaveTrainingDocument} from "../../data-types/training.model";
import {TrainingService} from "../../services/training.service";
import {EmployeeDocument} from "../../data-types/notes.model";
import {ErrorResponseModel} from "../../data-types/error-response.model";

@Component({
  selector: 'app-create-training',
  templateUrl: './create-training.component.html',
  styleUrl: './create-training.component.sass'
})
export class CreateTrainingComponent{

  userId = localStorage.getItem('userId');
  loading = false;
  protected readonly PATHS = PATHS;
  createTrainingForm!: FormGroup;

  fileType: any;
  fileName: any;
  file: any;
  keywords: any;
  isInvalid = false;



  @ViewChild('dragZoneRef') dragZone!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private trainingService: TrainingService,
    private router: Router,
  ) {
    this.createForm();
  }

  createForm() {
      this.createTrainingForm = this.formBuilder.group({
          name: ['', Validators.required],
          description: ['', Validators.required],
          requiredLevel: ['', [Validators.required, Validators.pattern('^([1-9][0-9]*)$')]],
          reward: ['', [Validators.required, Validators.pattern('^([1-9][0-9]*)$')]]
      });
  }

  onDragOver(event: any) {
    event.preventDefault();
    this.dragZone.nativeElement.classList.add('drag-active');
  }

  onDragEnd(event: any) {
    event.preventDefault();
    this.dragZone.nativeElement.classList.remove('drag-active');
  }

  onFileDrop(event: any) {
    event.preventDefault();
    this.dragZone.nativeElement.classList.remove('drag-active');
    const files = event.dataTransfer.files;
    if(files.length > 1) {
      this.notificationService.notify({
        message: "Only one file is allowed",
        type: NotificationType.error,
      })
      return;
    }

    if (files.length == 1 && files[0].type !== 'application/pdf') {
      this.notificationService.notify({
        message: "Only PDF files are allowed",
        type: NotificationType.error,
      })
      return;
    }
    this.isInvalid = false;
    this.updateFile(files[0]);
  }

  updateFile(file: any) {
    this.file = file
    this.fileType = file.type
    this.fileName = file.name
  }

  onFileChange(event: any) {
    const file: File = event.target.files[0];

    if (file.type !== 'application/pdf') {
      this.notificationService.notify({
        message: "Only PDF files are allowed",
        type: NotificationType.error,
      })
      return;
    }

    if (file) {
      this.isInvalid = false;
      this.fileType = file.type;
      this.fileName = file.name;
      this.file = file;
    }
  }

  removeFile(event: MouseEvent) {
    event.stopPropagation();
    this.file = null;
    this.fileName = null;
    this.fileType = null;
  }

  downloadDocument(event: MouseEvent){
    event.stopPropagation();
    const blob = new Blob([this.file], {
      type: `application/${this.fileType}`,
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = this.fileName;
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  resetWarnings() {
    this.isInvalid = false;
  }
  createTraining() {
    if (this.createTrainingForm.invalid) {
      this.isInvalid = true;
      this.notificationService.notify({
        message: 'Complete all the fields to create the training!',
        type: NotificationType.error,
      });
      return;
    }
    this.isInvalid = false;
    const createTrainingData: SaveTrainingDocument = {
        title: this.createTrainingForm.get('name')?.value,
        text: this.createTrainingForm.get('description')?.value,
        requiredLevel: this.createTrainingForm.get('requiredLevel')?.value,
        reward: this.createTrainingForm.get('reward')?.value,
        userId: parseInt(this.userId || '-1'),
        totalPages: 0,
        keywords: this.keywords
        };
    if (this.file) {
      this.file.arrayBuffer().then((buff: ArrayBuffer) => {
        const x = new Uint8Array(buff);
        createTrainingData.file = {
          name: this.fileName,
          type: this.fileType,
          buffer: Array.from(x),
        };
        this.saveTraining(createTrainingData);
      });
    } else {
        this.saveTraining(createTrainingData);
    }
  }

  saveTraining(training: SaveTrainingDocument) {
    this.trainingService.createTraining(training).subscribe({
      next: () => {
        this.notificationService.notify({
          message: 'Training saved successfully! ',
          type: NotificationType.success,
        });
        this.navigateToTrainingsView();
      },
      error: (error: any) => {
        if (error.error instanceof ErrorEvent) {
          this.isInvalid = true;
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

  keywordsChanged(keywords: string[]): void {
    this.keywords = JSON.stringify(keywords).slice(1, -1);
  }

  navigateToTrainingsView(): void {
    this.router.navigate([`trainings`]);
  }
}