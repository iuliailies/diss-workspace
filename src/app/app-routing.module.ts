import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import {AlreadyAuthGuardService} from "./auth/shared/already-auth-guard.service";
import {AuthGuardAdminService} from "./auth/shared/auth-guard-admin.service";
import {AuthGuardOtherService} from "./auth/shared/auth-guard-other.service";
import {AuthGuardLoginService} from "./auth/shared/auth-guard-login.service";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'users',
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
    canActivate: [AlreadyAuthGuardService, AuthGuardAdminService],
  },
  {
    path: 'company-docs',
    loadChildren: () =>
      import('./company-documents/company-documents.module').then(
        (m) => m.CompanyDocumentsModule,
      ),
    canActivate: [AlreadyAuthGuardService, AuthGuardOtherService],
  },
  {
    path: 'notes',
    loadChildren: () =>
      import('./notes/notes.module').then((m) => m.NotesModule),
    canActivate: [AlreadyAuthGuardService, AuthGuardOtherService],
  },
  {
    path: 'trainings',
    loadChildren: () =>
      import('./trainings/trainings.module').then((m) => m.TrainingsModule),
    canActivate: [AlreadyAuthGuardService, AuthGuardOtherService],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [AlreadyAuthGuardService, AuthGuardOtherService],
  },
  {
    path: 'login',
    component: LoginComponent,
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [AuthGuardLoginService],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
