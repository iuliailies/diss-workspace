import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { NoteComponent } from './note/note.component';



@NgModule({
  declarations: [
    IndexComponent,
    NoteComponent
  ],
  imports: [
    CommonModule
  ]
})
export class NotesModule { }
