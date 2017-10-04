import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TokenfieldComponent } from './tokenfield.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
  ],
  declarations: [
    TokenfieldComponent,
  ],
  exports: [
    TokenfieldComponent,
    FormsModule,
  ],
})
export class TokenfieldModule { }
