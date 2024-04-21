import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { RouterModule } from '@angular/router';
import { EllipsisDirective } from './directives/ellipsis.directive';
import { ContentEditableDirective } from './directives/content-editable.directive';
import { KeywordsComponent } from './keywords/keywords.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    NavComponent,
    ContentEditableDirective,
    EllipsisDirective,
    KeywordsComponent,
  ],
  exports: [NavComponent, ContentEditableDirective, EllipsisDirective, KeywordsComponent],
  imports: [
    CommonModule,
    RouterModule ,
    FormsModule
  ]
})
export class CoreModule { }
