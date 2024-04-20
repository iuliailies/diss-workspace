import { Component } from '@angular/core';
import { PATHS } from '../../app.constants';
import { Document } from '../notes.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.sass'
})
export class IndexComponent {
  PATHS = PATHS;
  documents: Document[] = [{
    name: 'Document 1'
  }, {
    name: 'Document 2'
  }]
}
