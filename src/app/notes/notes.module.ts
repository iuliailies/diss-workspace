import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { NoteComponent } from './note/note.component';
import { NotesRoutingModule } from './notes-routing.module';
import {SearchBarComponent} from "../shared/components/search-bar/search-bar.component";
import { CoreModule } from '../core/core.module';



@NgModule({
  declarations: [
    IndexComponent,
    NoteComponent,
    SearchBarComponent
  ],
  imports: [
    CommonModule,
    NotesRoutingModule,
    CoreModule
  ]
})
export class NotesModule { }
