import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'notes',
    loadChildren: () => import('./notes/notes.module').then(m => m.NotesModule),
  },
  {
    path: 'company-docs',
    loadChildren: () => import('./company-documents/company-documents.module').then(m => m.CompanyDocumentsModule),
  },
  {
    path: 'trainings',
    loadChildren: () => import('./trainings/trainings.module').then(m => m.TrainingsModule),
  },
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
