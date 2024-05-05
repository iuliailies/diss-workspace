import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { CoreModule } from '../core/core.module';
import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    CoreModule,
    MatTooltip,
    MatProgressSpinner,
  ],
})
export class ProfileModule {}
