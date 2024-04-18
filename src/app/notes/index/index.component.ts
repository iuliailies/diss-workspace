import { Component } from '@angular/core';
import { PATHS } from '../../app.constants';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.sass'
})
export class IndexComponent {
  PATHS = PATHS;
}
