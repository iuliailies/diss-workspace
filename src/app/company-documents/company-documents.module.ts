import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { DocumentComponent } from './document/document.component';
import { CompanyDocumentsRoutingModule } from './company-documents-routing.module';
import { CoreModule } from "../core/core.module";
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CreateDocumentComponent } from './create-document/create-document.component';

@NgModule({
    declarations: [IndexComponent, DocumentComponent, CreateDocumentComponent],
    imports: [CommonModule, CompanyDocumentsRoutingModule, CoreModule, MatProgressSpinner]
})
export class CompanyDocumentsModule {}
