import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import {CreateUserComponent} from "./create-user/create-user.component";
import {UserComponent} from "./user/user.component";

const routes: Routes = [
  { path: '', pathMatch: 'full', component: IndexComponent },
  { path: 'new', pathMatch: 'full', component: CreateUserComponent },
  { path: ':id', pathMatch: 'full', component: UserComponent },
  // TODO: add other routes
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
