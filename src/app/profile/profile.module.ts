import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [IndexComponent],
  imports: [CommonModule, ProfileRoutingModule, CoreModule],
})
export class ProfileModule {}
