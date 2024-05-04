import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationService} from "../../services/notification.service";
import {TrainingService} from "../../services/training.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {NotificationType} from "../../data-types/notification.model";
import {File} from "../../data-types/file.model";
import {SaveTrainingDocument} from "../../data-types/training.model";
import {ErrorResponseModel} from "../../data-types/error-response.model";
import {ConfirmationDialogBoxComponent} from "../../core/confirmation-dialog-box/confirmation-dialog-box.component";
import {PATHS} from "../../app.constants";
import {UserType} from "../../data-types/user.model";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.sass'
})
export class CreateUserComponent implements OnInit{
  userTypes: UserType[] = [];
  loading = false;
  createUserForm!: FormGroup;

  protected readonly PATHS = PATHS;
  hidePassword1 = true;
  hidePassword2 = true;

  isInvalid = false;
  contentUpdated = false;

  @ViewChild('dragZoneRef') dragZone!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private trainingService: TrainingService,
    private dialogBox: MatDialog,
    private router: Router,
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.time('LoadUserTypes');
    this.userTypes = Object.values(UserType);
    console.timeEnd('LoadUserTypes');
   // this.userTypes = Object.values(UserType);
  }

  createForm() {
    this.createUserForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      role: ['', Validators.required],
      department: ['', Validators.required],
      location: ['', Validators.required],
      type: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  resetWarnings() {
    this.isInvalid = false;
  }

  createUser() {

  }

  saveTraining(training: SaveTrainingDocument) {

  }

  navigateToUsersView(): void {
    this.router.navigate([`users`]);
  }

  goBack() {
    if (this.contentUpdated || this.createUserForm.touched) {
      const dialogResponse = this.dialogBox.open(
        ConfirmationDialogBoxComponent,
        {
          data: `Do you want to save the changes?`,
          disableClose: true,
          autoFocus: false,
        },
      );
      dialogResponse.afterClosed().subscribe((response) => {
        if (response) {
          this.createUser();
        }
        else {
          this.navigateToUsersView();
        }
      });
    }
    else {
      this.navigateToUsersView();
    }
  }

}
