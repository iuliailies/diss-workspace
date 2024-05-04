import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import {CoreModule} from "../core/core.module";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {UsersRoutingModule} from "./users-routing.module";
import { CreateUserComponent } from './create-user/create-user.component';
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    IndexComponent,
    CreateUserComponent
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
