import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { WIFormGroupComponent, WIFormErrorDirective } from './forms';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [
    WIFormGroupComponent,
    WIFormErrorDirective,
  ],
  exports: [
    ReactiveFormsModule,
    WIFormGroupComponent,
    WIFormErrorDirective,
  ]
})
export class WIFormsModule { }
