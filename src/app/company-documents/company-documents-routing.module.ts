import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnsavedChangesGuardService } from '../core/unsaved-changes-guard.service';
import { CreateDocumentComponent } from './create-document/create-document.component';
import { DocumentComponent } from './document/document.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: IndexComponent,
    canDeactivate: [UnsavedChangesGuardService],
  },
  {
    path: 'new',
    pathMatch: 'full',
    component: CreateDocumentComponent,
    canDeactivate: [UnsavedChangesGuardService],
  },
  {
    path: ':id',
    pathMatch: 'full',
    component: DocumentComponent,
    canDeactivate: [UnsavedChangesGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyDocumentsRoutingModule {}
