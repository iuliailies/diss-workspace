import {Component, OnInit} from '@angular/core';
import {TrainingService} from "../../services/training.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TrainingDocument} from "../../data-types/training.model";
import {PDFDocumentProxy} from "ng2-pdf-viewer";
import {PATHS} from "../../app.constants";
import {NotificationService} from "../../services/notification.service";
import {NotificationType} from "../../data-types/notification.model";
import {Badge} from "../../data-types/badge.model";
import {ErrorResponseModel} from "../../data-types/error-response.model";

@Component({
    selector: 'app-training',
    templateUrl: './training.component.html',
    styleUrl: './training.component.sass',
})
export class TrainingComponent implements OnInit {
    title = 'pdf-to-image';
    training: any;
    pdfSrc = "";
    totalPages: number = 0;
    currentPage: number = 1;
    loading = false;
    userId = localStorage.getItem('userId');
    progressStatus: string = 'In progress';
    readOnly = false;

    constructor(private trainingService: TrainingService, private activatedRoute: ActivatedRoute,
                private notificationService: NotificationService, private router: Router) {
    }

    ngOnInit() {
        this.fetchTraining();
    }

    fetchTraining() {
        this.activatedRoute.paramMap.subscribe((params) => {
            const trainingId = params.get('id');
            if (trainingId) {
                this.trainingService.getTraining({trainingId: trainingId, userId: this.userId}).subscribe((training) => {
                    this.training = training as TrainingDocument;
                    this.initializeFields();
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
        if (this.training.badge.progressStatus === 'Completed')
            this.readOnly = true;
        this.readDocument();
    }

    goBack() {
        if (this.isCompleted() || this.readOnly){
            this.router.navigate(['trainings']);
        } else {
            this.updateTrainingProgress();
        }
    }

    updateTrainingProgress() {

        const badge: Badge = {
            trainingId: this.training.id,
            userId: parseInt(this.userId || '-1'),
            currentPage: this.currentPage,
            progressStatus: this.progressStatus
        };

        this.trainingService.updateBadge(badge).subscribe({
            next: () => {
                if (badge.progressStatus === 'In progress') {
                    this.notificationService.notify({
                        message: 'Progress saved successfully',
                        type: NotificationType.success,
                    });
                    this.router.navigate(['trainings']);
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

    readDocument() {
        if (typeof (FileReader) !== 'undefined') {
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
            const blob = new Blob([bytes.buffer], {type: `application/pdf`});
            reader.readAsArrayBuffer(blob);
        }
    }

    // after pdf uploaded
    afterLoadComplete(pdf: PDFDocumentProxy) {
        this.totalPages = pdf.numPages;
    }

    // show the previous page
    public previous() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    // show the next page
    public next() {
        if (this.totalPages > this.currentPage) {
            this.currentPage++;
        }
    }

    protected readonly PATHS = PATHS;

    finish() {
        this.progressStatus = 'Completed'
        this.updateTrainingProgress();
    }
}
