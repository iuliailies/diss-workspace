import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { PATHS } from '../../app.constants';
import { SaveUser, UserType } from '../../data-types/user.model';
import { NotificationType } from '../../data-types/notification.model';
import { UserService } from '../../services/user.service';
import { ErrorResponseModel } from '../../data-types/error-response.model';
import {Observable} from "rxjs";
import {ConfirmationDialogService} from "../../services/confirmation-dialog.service";
import {CanComponentDeactivate} from "../../core/unsaved-changes-guard.service";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.sass',
})
export class CreateUserComponent implements OnInit, CanComponentDeactivate{
  userTypes: UserType[] = [];
  loading = false;
  createUserForm!: FormGroup;

  protected readonly PATHS = PATHS;
  hidePassword1 = true;
  hidePassword2 = true;

  isInvalid = false;
  isEmailInvalid = false;
  isPhoneNumberInvalid = false;
  isTypeInvalid = false;
  isPasswordInvalid = false;

  saving = false;

  constructor(
    private formBuilder: FormBuilder,
    private confirmationDialogService: ConfirmationDialogService,
    private notificationService: NotificationService,
    private userService: UserService,
    private router: Router,
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.userTypes = Object.values(UserType);
    this.saving = false;
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
      type: ['Select type', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  resetWarnings() {
    this.isInvalid = false;
    this.isEmailInvalid = false;
    this.isPhoneNumberInvalid = false;
    this.isTypeInvalid = false;
    this.isPasswordInvalid = false;
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

  checkInvalidType() {
    const typeControl = this.createUserForm.controls['type'];

    const originalValidators = typeControl.validator;

    typeControl.setValidators([
      Validators.pattern('^(?!Select type$).*$'), // Regex that rejects only "Select type"
    ]);
    typeControl.updateValueAndValidity();

    const isInvalid = typeControl.invalid;

    typeControl.setValidators(originalValidators);
    typeControl.updateValueAndValidity();

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

  checkInvalidPassword() {
    return (
      this.createUserForm.controls['password'].value !==
      this.createUserForm.controls['confirmPassword'].value
    );
  }

  validateUser() {
    if (this.createUserForm.invalid) {
      this.isInvalid = true;
      this.notificationService.notify({
        message: 'Complete all the fields to create the user!',
        type: NotificationType.error,
      });
      return false;
    } else if (this.checkInvalidPassword()) {
      this.isPasswordInvalid = true;
      this.notificationService.notify({
        message: 'Passwords do not match!',
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
    } else if (this.checkInvalidType()) {
      this.isTypeInvalid = true;
      this.notificationService.notify({
        message: 'Select a user type!',
        type: NotificationType.error,
      });
      return false;
    }
    return true;
  }

  createUser() {
    if (!this.validateUser()) {
      return;
    }

    const user: SaveUser = {
      email: this.createUserForm.get('email')?.value,
      password: this.createUserForm.get('password')?.value,
      firstname: this.createUserForm.get('firstname')?.value,
      lastname: this.createUserForm.get('lastname')?.value,
      phoneNumber: this.createUserForm.get('phoneNumber')?.value,
      role: this.createUserForm.get('role')?.value,
      department: this.createUserForm.get('department')?.value,
      location: this.createUserForm.get('location')?.value,
      level: 1,
      points: 0,
      type: this.createUserForm.get('type')?.value,
    };

    this.saveUser(user);
  }

  saveUser(user: SaveUser) {
    this.saving = true;
    this.loading = true;
    // Call the service to save the user
    this.userService.createUser(user).subscribe({
      next: (response) => {
        this.notificationService.notify({
          message: 'User saved successfully!',
          type: NotificationType.success,
        });
        this.loading = false;
        this.navigateToUserView(response);
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

  navigateToUserView(user: any): void {
    this.router.navigate([`users/${user.id}`]);
  }


  // Method to determine whether navigation can occur
  canDeactivate(): Observable<boolean> | boolean {

    // If there are no unsaved changes, allow navigation immediately
    if (!this.createUserForm.touched || this.saving) {
      return true;
    }

    return this.confirmationDialogService.confirmNavigation();
  }

}

