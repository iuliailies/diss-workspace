import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { RouterModule } from '@angular/router';
import { EllipsisDirective } from './directives/ellipsis.directive';
import { ContentEditableDirective } from './directives/content-editable.directive';



@NgModule({
  declarations: [
    NavComponent,
    ContentEditableDirective,
    EllipsisDirective
  ],
  exports: [NavComponent, ContentEditableDirective, EllipsisDirective],
  imports: [
    CommonModule,
    RouterModule 
  ]
})
export class CoreModule { }
