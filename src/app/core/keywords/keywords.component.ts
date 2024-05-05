import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { PATHS } from '../../app.constants';

@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrl: './keywords.component.sass',
})
export class KeywordsComponent {
  PATHS = PATHS;
  @Output() keywordsChanged = new EventEmitter<string[]>();
  @Input() keywords: string[] = [];
  @Input() readOnly: boolean = false;
  keywordInput: string = '';

  addKeyword(): void {
    this.keywords.push(this.keywordInput);
    this.keywordsChanged.emit(this.keywords);
    this.keywordInput = '';
  }

  removeKeyword(index: number): void {
    this.keywords.splice(index, 1);
    this.keywordsChanged.emit(this.keywords);
  }
}
