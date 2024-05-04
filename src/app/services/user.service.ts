import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserLogin } from '../data-types/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authUrl = 'http://localhost:8090/auth';

  private userUrl = 'http://localhost:8090/user';

  constructor(private httpClient: HttpClient) {}

  public login(loginData: UserLogin) {
    return this.httpClient.post(`${this.authUrl}/login`, loginData);
  }

  public getUserInfo(id: any): Observable<User> {
    return this.httpClient.get<User>(`${this.userUrl}/${id}`);
  }

  public getUserBadges(id: any): Observable<any> {
    return this.httpClient.get(`${this.userUrl}/badges/${id}`);
  }

  getUsers(): Observable<any> {
    return this.httpClient.get(`${this.userUrl}/get-users`);
  }
}
