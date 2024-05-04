import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import {CreateUserComponent} from "./create-user/create-user.component";

const routes: Routes = [
  { path: '', pathMatch: 'full', component: IndexComponent },
  { path: 'new', pathMatch: 'full', component: CreateUserComponent },
  // { path: ':id', pathMatch: 'full', component: NoteComponent },
  // TODO: add other routes
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
