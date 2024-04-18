import { Component, OnInit } from '@angular/core';
import { Document } from '../notes.model';
import { PATHS } from '../../app.constants';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrl: './note.component.sass'
})
export class NoteComponent implements OnInit {

  PATHS = PATHS

  loading = false;
  readOnly = false; // TODO: will be readonly if note author is not the logged in user
  document: Document = {name: 'New document'} // TODO: get from api inside ngOnInit

  ngOnInit(): void {
    // TODO: call api to load the actual document
  }

  changeDocumentName(event: Event): void {
    const input = event.target as HTMLElement;
    const inputText = input.innerText.trim();
    if (!inputText.length) {
      input.innerText = this.document.name;
      return;
    }
    if (this.document.name !== input.innerText) {
      this.document.name = input.innerText;
      this.saveDocument();
    }
  }

  saveDocument(): void {
    console.log("saving")
    // TODO
  }
}
