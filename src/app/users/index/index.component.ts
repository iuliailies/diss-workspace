import { Component, OnInit } from '@angular/core';
import { PATHS } from '../../app.constants';
import { ActivatedRoute, Router } from '@angular/router';
import {User} from "../../data-types/user.model";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.sass',
})
export class IndexComponent implements OnInit {
  PATHS = PATHS;
  users: User[] = [];
  userId = localStorage.getItem('userId');
  loading = true;

  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(() => {
      this.fetchUsers();
    });
  }

  fetchUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      this.loading = false;
    });
  }

  getUserName(user: any): string {
    return user.firstname + ' ' + user.lastname;
  }


  viewUser(id: any) {
    this.router.navigate([`users/${id}`]);
  }
}
