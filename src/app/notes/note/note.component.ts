import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Document } from '../notes.model';
import { PATHS } from '../../app.constants';
import { NoteService } from '../note.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrl: './note.component.sass'
})
export class NoteComponent implements OnInit {

  PATHS = PATHS
  @ViewChild('noteContent') noteContent!: ElementRef

  loading = false;
  readOnly = false; // TODO: will be readonly if note author is not the logged in user
  createMode = true;
  document: Document = {
    title: 'New document',
    text: '',
    document: undefined,
    keywords: '',
    created: new Date(),
    lastModified: new Date(),
    userId: 0,
    comments: []
  } // TODO: get from api inside ngOnInit

  constructor(private noteService: NoteService, private router: Router) {
    this.createMode = this.router.url.indexOf('new') > -1
  }

  ngOnInit(): void {
    // TODO: call api to load the actual document
  }

  changeDocumentName(event: Event): void {
    const input = event.target as HTMLElement;
    const inputText = input.innerText.trim();
    if (!inputText.length) {
      input.innerText = this.document.title;
      return;
    }
    if (this.document.title !== input.innerText) {
      this.document.title = input.innerText;
    }
  }

  saveDocument(): void {
    if (this.createMode) {
      this.createDocument()
    } else {
      this.updateDocument()
    }
  }

  createDocument() : void {
    const documentToSend: Document = {
      title: this.document.title,
      text: this.noteContent.nativeElement.innerHTML,
      keywords: 'sample, example, json',
      visibility: this.document.visibility,
      lastModified: new Date(),
      userId: 1,
    };
    this.noteService.createNote(documentToSend).subscribe((response: Document) => {
      const documentId= response.id;
      this.router.navigate([`notes/${documentId}`]);
    }, error => {

    })
  }

  updateDocument() : void {

  }

  changeVisilibity(): void {
    this.document.visibility = !this.document.visibility
  }
}
