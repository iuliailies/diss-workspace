import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { DocumentComponent } from './document/document.component';
import { CompanyDocumentsRoutingModule } from './company-documents-routing.module';

@NgModule({
  declarations: [IndexComponent, DocumentComponent],
  imports: [CommonModule, CompanyDocumentsRoutingModule],
})
export class CompanyDocumentsModule {}
