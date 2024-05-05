import { Component } from '@angular/core';
import { PATHS } from '../../app.constants';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.sass',
})
export class SearchBarComponent {
  protected readonly PATHS = PATHS;
}
