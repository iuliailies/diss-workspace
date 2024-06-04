import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PATHS } from '../../app.constants';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.sass',
})
export class SearchBarComponent {
  protected readonly PATHS = PATHS;

  @Output() search: EventEmitter<any> = new EventEmitter();
  @Input('placeholder') placeholder: string = 'Search based on keywords, text, title...';

  triggerSearch(searchString: any) {
    console.log(searchString);
    this.search.emit(searchString);
  }
}
