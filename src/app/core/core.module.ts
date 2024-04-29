import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { RouterModule } from '@angular/router';
import { EllipsisDirective } from './directives/ellipsis.directive';
import { ContentEditableDirective } from './directives/content-editable.directive';
import { KeywordsComponent } from './keywords/keywords.component';
import { FormsModule } from '@angular/forms';
import { ConfirmationDialogBoxComponent } from './confirmation-dialog-box/confirmation-dialog-box.component';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import {
  MatSnackBarAction,
  MatSnackBarLabel,
} from '@angular/material/snack-bar';
import { NotificationComponent } from './notification/notification.component';
import { SearchBarComponent } from './search-bar/search-bar.component';

@NgModule({
  declarations: [
    NavComponent,
    ContentEditableDirective,
    EllipsisDirective,
    KeywordsComponent,
    ConfirmationDialogBoxComponent,
    NotificationComponent,
    SearchBarComponent,
  ],
  exports: [
    NavComponent,
    ContentEditableDirective,
    EllipsisDirective,
    KeywordsComponent,
    NotificationComponent,
    SearchBarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatDialogContent,
    MatDialogActions,
    MatSnackBarLabel,
    MatSnackBarAction,
  ],
})
export class CoreModule {}
