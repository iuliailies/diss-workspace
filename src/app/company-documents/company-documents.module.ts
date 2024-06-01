import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CoreModule } from '../core/core.module';
import { CompanyDocumentsRoutingModule } from './company-documents-routing.module';
import { CreateDocumentComponent } from './create-document/create-document.component';
import { DocumentComponent } from './document/document.component';
import { IndexComponent } from './index/index.component';
import {MatTooltip} from "@angular/material/tooltip";

@NgModule({
  declarations: [IndexComponent, DocumentComponent, CreateDocumentComponent],
    imports: [
        CommonModule,
        CompanyDocumentsRoutingModule,
        CoreModule,
        MatProgressSpinner,
        MatTooltip,
    ],
})
export class CompanyDocumentsModule {}
