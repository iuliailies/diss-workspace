import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { TrainingComponent } from './training/training.component';



@NgModule({
  declarations: [
    IndexComponent,
    TrainingComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TrainingsModule { }
