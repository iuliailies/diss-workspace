import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { NoteComponent } from './note/note.component';
import { NotesRoutingModule } from './notes-routing.module';
import { SearchBarComponent } from '../core/search-bar/search-bar.component';
import { CoreModule } from '../core/core.module';
import { CreateNoteComponent } from './create-note/create-note.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    IndexComponent,
    NoteComponent,
    CreateNoteComponent,
  ],
  exports: [NoteComponent],
  imports: [CommonModule, NotesRoutingModule, CoreModule, MatProgressSpinner],
})
export class NotesModule {}
