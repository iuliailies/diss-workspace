import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { PATHS } from '../../app.constants';

@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrl: './keywords.component.sass'
})
export class KeywordsComponent {
  PATHS = PATHS;
  @Output() keywordsChanged = new EventEmitter<string[]>();
  keywordInput: string = '';

  keywords: string[] = []

  addKeyword() : void {
    console.log("adding keyword", this.keywordInput)
    this.keywords.push(this.keywordInput);
    this.keywordsChanged.emit(this.keywords)
    this.keywordInput = ''
  }

  removeKeyword(index: number): void {
    this.keywords.splice(index, 1);
    this.keywordsChanged.emit(this.keywords)
  }

}
