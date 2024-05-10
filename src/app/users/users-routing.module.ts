import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { UserComponent } from './user/user.component';
import { UnsavedChangesGuardService } from '../core/unsaved-changes-guard.service';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: IndexComponent },
  {
    path: 'new',
    pathMatch: 'full',
    component: CreateUserComponent,
    canDeactivate: [UnsavedChangesGuardService],
  },
  {
    path: ':id',
    pathMatch: 'full',
    component: UserComponent,
    canDeactivate: [UnsavedChangesGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
