import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { NoteComponent } from './note/note.component';
import { CreateNoteComponent } from './create-note/create-note.component';
import { UnsavedChangesGuardService } from '../core/unsaved-changes-guard.service';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: IndexComponent },
  {
    path: 'new',
    pathMatch: 'full',
    component: CreateNoteComponent,
    canDeactivate: [UnsavedChangesGuardService],
  },
  {
    path: ':id',
    pathMatch: 'full',
    component: NoteComponent,
    canDeactivate: [UnsavedChangesGuardService],
  },
  // TODO: add other routes
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotesRoutingModule {}
