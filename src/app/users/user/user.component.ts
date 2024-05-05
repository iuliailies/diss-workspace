import { Component, OnInit } from '@angular/core';
import { User, UserType } from '../../data-types/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from '../../data-types/notification.model';
import { ErrorResponseModel } from '../../data-types/error-response.model';
import { ConfirmationDialogBoxComponent } from '../../core/confirmation-dialog-box/confirmation-dialog-box.component';
import { PATHS } from '../../app.constants';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.sass',
})
export class UserComponent implements OnInit {
  userTypes: UserType[] = [];
  loading = false;
  createUserForm!: FormGroup;

  protected readonly PATHS = PATHS;

  isInvalid = false;
  isEmailInvalid = false;
  isPhoneNumberInvalid = false;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private userService: UserService,
    private dialogBox: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.userTypes = Object.values(UserType);
    this.fetchUser();
  }

  fetchUserTypes() {
    if (this.createUserForm.get('type')?.value === 'ADMIN') {
      this.userTypes = [UserType.ADMIN];
    } else {
      this.userTypes = [UserType.TRAINER, UserType.EMPLOYEE, UserType.HR];
    }
  }

  fetchUser() {
    this.loading = true;
    this.activatedRoute.paramMap.subscribe((params) => {
      const userId = params.get('id');
      if (userId) {
        this.userService.getUserInfo(userId).subscribe((user) => {
          this.createUserForm.patchValue(user);
          this.fetchUserTypes();
          this.loading = false;
        });
      }
    });
  }

  createForm() {
    this.createUserForm = this.formBuilder.group({
      id: [null],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      role: ['', Validators.required],
      department: ['', Validators.required],
      location: ['', Validators.required],
      points: [null],
      level: [null],
      type: ['', Validators.required],
    });
  }

  resetWarnings() {
    this.isInvalid = false;
    this.isEmailInvalid = false;
    this.isPhoneNumberInvalid = false;
  }

  checkInvalidEmail() {
    const emailControl = this.createUserForm.controls['email'];

    const originalValidators = emailControl.validator;

    emailControl.setValidators([Validators.required, Validators.email]);
    emailControl.updateValueAndValidity();

    const isInvalid = emailControl.invalid;

    emailControl.setValidators(originalValidators);
    emailControl.updateValueAndValidity();

    return isInvalid;
  }

  checkInvalidPhoneNumber() {
    const phoneNumberControl = this.createUserForm.controls['phoneNumber'];

    const originalValidators = phoneNumberControl.validator;

    phoneNumberControl.setValidators([
      Validators.required,
      Validators.pattern(/^\+40[2-9][0-9]{8}$/),
    ]);
    phoneNumberControl.updateValueAndValidity();

    const isInvalid = phoneNumberControl.invalid;

    phoneNumberControl.setValidators(originalValidators);
    phoneNumberControl.updateValueAndValidity();

    return isInvalid;
  }

  deleteUser() {
    const dialogResponse = this.dialogBox.open(ConfirmationDialogBoxComponent, {
      data: `Do you want to delete the user?`,
      disableClose: true,
      autoFocus: false,
    });
    dialogResponse.afterClosed().subscribe((response) => {
      if (response) {
        this.loading = true;
        this.userService
          .deleteUser(this.createUserForm.get('id')?.value)
          .subscribe({
            next: () => {
              this.notificationService.notify({
                message: 'User deleted successfully!',
                type: NotificationType.success,
              });
              this.loading = false;
              this.navigateToUsersView();
            },
            error: (error) => {
              this.notificationService.notify({
                message: 'An error occurred! Please try again later!',
                type: NotificationType.error,
              });
              this.loading = false;
            },
          });
      }
    });
  }

  validateUser() {
    if (this.createUserForm.invalid) {
      this.isInvalid = true;
      this.notificationService.notify({
        message: 'Complete all the fields to update the user!',
        type: NotificationType.error,
      });
      return false;
    } else if (this.checkInvalidEmail()) {
      this.isEmailInvalid = true;
      this.notificationService.notify({
        message: 'Invalid email address!',
        type: NotificationType.error,
      });
      return false;
    } else if (this.checkInvalidPhoneNumber()) {
      this.isPhoneNumberInvalid = true;
      this.notificationService.notify({
        message: 'Invalid phone number!',
        type: NotificationType.error,
      });
      return false;
    }
    return true;
  }

  updateUser() {
    if (!this.validateUser()) {
      return;
    }

    const user: User = {
      id: this.createUserForm.get('id')?.value,
      email: this.createUserForm.get('email')?.value,
      firstname: this.createUserForm.get('firstname')?.value,
      lastname: this.createUserForm.get('lastname')?.value,
      phoneNumber: this.createUserForm.get('phoneNumber')?.value,
      role: this.createUserForm.get('role')?.value,
      department: this.createUserForm.get('department')?.value,
      location: this.createUserForm.get('location')?.value,
      level: this.createUserForm.get('level')?.value,
      points: this.createUserForm.get('points')?.value,
      type: this.createUserForm.get('type')?.value,
    };

    this.saveUser(user);
  }

  saveUser(user: User) {
    this.loading = true;
    // Call the service to save the user
    this.userService.updateUser(user).subscribe({
      next: () => {
        this.notificationService.notify({
          message: 'User saved successfully!',
          type: NotificationType.success,
        });
        this.loading = false;
        this.navigateToUsersView();
      },
      error: (error) => {
        if (error.error instanceof ErrorEvent) {
          this.isInvalid = true;
          this.notificationService.notify({
            message: 'An error occurred! Please try again later!',
            type: NotificationType.error,
          });
          this.loading = false;
        } else {
          const errResponse: ErrorResponseModel =
            error.error as ErrorResponseModel;
          if (
            errResponse.errorMessage.includes(
              'There is an conflicting entry in the database.',
            )
          ) {
            this.notificationService.notify({
              message: 'There already exists an account with that email!',
              type: NotificationType.error,
            });
            this.isEmailInvalid = true;
            this.loading = false;
          } else {
            this.notificationService.notify({
              message: errResponse.errorMessage,
              type: NotificationType.error,
            });
            this.loading = false;
          }
        }
      },
    });
  }

  navigateToUsersView(): void {
    this.router.navigate([`users`]);
  }

  goBack() {
    if (this.createUserForm.touched) {
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
          this.updateUser();
        } else {
          this.navigateToUsersView();
        }
      });
    } else {
      this.navigateToUsersView();
    }
  }
}
