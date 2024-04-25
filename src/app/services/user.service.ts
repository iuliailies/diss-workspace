import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserLogin } from '../data-types/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authUrl = 'http://localhost:8090/auth';

  constructor(private httpClient: HttpClient) {}

  public login(loginData: UserLogin) {
    return this.httpClient.post(`${this.authUrl}/login`, loginData);
  }
}
