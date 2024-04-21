import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserLoginData} from "../data-types/UserLoginData";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private authUrl = 'http://localhost:8090/auth';

    constructor(private httpClient: HttpClient) {
    }

    public login(loginData: UserLoginData) {
        return this.httpClient.post(`${this.authUrl}/login`, loginData)
    }

}
