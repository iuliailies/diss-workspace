import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingComponent } from './training/training.component';
import { TrainingsRoutingModule } from './trainings-routing.module';
import { CreateTrainingComponent } from './create-training/create-training.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {
  MatAccordion,
  MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {IndexComponent} from "./index/index.component";

@NgModule({
  declarations: [IndexComponent, TrainingComponent, CreateTrainingComponent],
  imports: [
    CommonModule,
    TrainingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    PdfViewerModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatAccordion,
    MatExpansionModule,
    MatProgressSpinner,
  ],
})
export class TrainingsModule {}
