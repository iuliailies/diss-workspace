import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import {CoreModule} from "../core/core.module";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {UsersRoutingModule} from "./users-routing.module";
import { CreateUserComponent } from './create-user/create-user.component';
import {ReactiveFormsModule} from "@angular/forms";
import { UserComponent } from './user/user.component';



@NgModule({
  declarations: [
    IndexComponent,
    CreateUserComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    MatProgressSpinner,
    UsersRoutingModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
