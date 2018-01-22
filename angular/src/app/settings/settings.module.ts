import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { WIFormsModule } from '../forms/forms.module';
import { SettingsComponent } from './settings.component';


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    WIFormsModule,
  ],
  declarations: [
    SettingsComponent,
  ],
})
export class SettingsModule { }
