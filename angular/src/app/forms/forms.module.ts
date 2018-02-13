import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { WIFieldDirective, WIFormGroupComponent, WIFormErrorDirective } from './forms';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [
    WIFieldDirective,
    WIFormGroupComponent,
    WIFormErrorDirective,
  ],
  exports: [
    ReactiveFormsModule,
    WIFieldDirective,
    WIFormGroupComponent,
    WIFormErrorDirective,
  ]
})
export class WIFormsModule { }
