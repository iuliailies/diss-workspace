import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { PATHS } from '../../app.constants';
import { User, UserLogin } from '../../data-types/user.model';
import { UserService } from '../../services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { parseJwt } from '../../utils/JWTParser';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponseModel } from '../../data-types/error-response.model';
import {LogoutService} from "../../services/logout.service";
import {ConfirmationDialogService} from "../../services/confirmation-dialog.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass',
})
export class LoginComponent {
  protected readonly PATHS = PATHS;
  hidePassword = true;
  showPasswordErrorMessage = false;
  errorMessage = '';
  loginUserDataFormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private cookieService: CookieService,
    private logoutService: LogoutService
  ) {}

  resetWarnings() {
    this.showPasswordErrorMessage = false;
  }

  loginUser() {
    const valuesFromForm = this.loginUserDataFormGroup.value;

    const loginData: UserLogin = {
      email: valuesFromForm.email!.toLowerCase(),
      password: valuesFromForm.password!,
    };

    if (!this.loginUserDataFormGroup.invalid) {
      this.userService.login(loginData).subscribe(this.handleResponseData);
    }
  }

  handleResponseData = {
    next: (result: any) => {
      this.cookieService.set('Token', result['token']);
      const jwt = parseJwt(result['token']);
      localStorage.setItem('userType', jwt['type']);
      localStorage.setItem('userId', jwt['id']);
      localStorage.setItem('userEmail', jwt['email']);
      this.logoutService.setLogoutInProgress(false);
      this.userService
        .getUserInfo(localStorage.getItem('userId'))
        .subscribe((user: User) => {
          localStorage.setItem('userFirstname', user.firstname);
          localStorage.setItem('userLastname', user.lastname);
          localStorage.setItem('userPoints', String(user.points));
          localStorage.setItem('userLevel', String(user.level));
          if(user.type === 'ADMIN') {
            this.router.navigate(['users']);
          } else {
            this.router.navigate(['notes']);
          }
        });
    },
    error: (error: HttpErrorResponse) => {
      if (error.error instanceof ErrorEvent) {
        this.errorMessage = 'An error occurred! Please try again later!';
      } else {
        const errResponse: ErrorResponseModel =
          error.error as ErrorResponseModel;
        this.errorMessage = errResponse.errorMessage;
        this.loginUserDataFormGroup.get('password')?.reset();
        this.loginUserDataFormGroup.get('email')?.reset();
        this.loginUserDataFormGroup.markAllAsTouched();
      }
      this.showPasswordErrorMessage = true;
    },
  };
}
