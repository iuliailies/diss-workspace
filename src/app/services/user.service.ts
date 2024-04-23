import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserLoginDataModel } from '../data-types/user-login-data.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authUrl = 'http://localhost:8090/auth';

  constructor(private httpClient: HttpClient) {}

  public login(loginData: UserLoginDataModel) {
    return this.httpClient.post(`${this.authUrl}/login`, loginData);
  }
}
