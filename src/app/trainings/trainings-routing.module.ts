import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { CreateTrainingComponent } from './create-training/create-training.component';
import { TrainingComponent } from './training/training.component';
import { UnsavedChangesGuardService } from '../core/unsaved-changes-guard.service';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: IndexComponent },
  {
    path: 'new',
    pathMatch: 'full',
    component: CreateTrainingComponent,
    canDeactivate: [UnsavedChangesGuardService],
  },
  { path: ':id', pathMatch: 'full', component: TrainingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingsRoutingModule {}
