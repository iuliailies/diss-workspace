import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { TrainingComponent } from './training/training.component';
import { TrainingsRoutingModule } from './trainings-routing.module';

@NgModule({
  declarations: [IndexComponent, TrainingComponent],
  imports: [CommonModule, TrainingsRoutingModule],
})
export class TrainingsModule {}
