import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { NoteComponent } from './note/note.component';
import { NotesRoutingModule } from './notes-routing.module';
import {SearchBarComponent} from "../shared/components/search-bar/search-bar.component";



@NgModule({
  declarations: [
    IndexComponent,
    NoteComponent,
    SearchBarComponent
  ],
    imports: [
        CommonModule,
        NotesRoutingModule
    ]
})
export class NotesModule { }
