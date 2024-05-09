import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SaveUser, User, UserLogin } from '../data-types/user.model';
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

  public getUsers(): Observable<any> {
    return this.httpClient.get(`${this.userUrl}/get-users`);
  }

  public createUser(user: SaveUser): Observable<any> {
    return this.httpClient.post(`${this.userUrl}/create-user`, user);
  }

  public updateUser(user: User): Observable<any> {
    return this.httpClient.put(`${this.userUrl}/update-user`, user);
  }

  public deleteUser(id: any): Observable<any> {
    return this.httpClient.delete(`${this.userUrl}/${id}`);
  }

  public searchUsers(searchKey: any): Observable<any> {
    return this.httpClient.get(`${this.userUrl}/search-users/${searchKey}`);
  }
}
