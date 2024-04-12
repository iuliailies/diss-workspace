import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { NoteComponent } from './note/note.component';
import { NotesRoutingModule } from './notes-routing.module';



@NgModule({
  declarations: [
    IndexComponent,
    NoteComponent
  ],
  imports: [
    CommonModule,
    NotesRoutingModule
  ]
})
export class NotesModule { }
