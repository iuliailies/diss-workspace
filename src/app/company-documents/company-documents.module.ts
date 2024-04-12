import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { DocumentComponent } from './document/document.component';



@NgModule({
  declarations: [
    IndexComponent,
    DocumentComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CompanyDocumentsModule { }
