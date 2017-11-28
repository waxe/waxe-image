import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SettingsComponent } from './settings.component';


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  declarations: [
    SettingsComponent,
  ],
})
export class SettingsModule { }
