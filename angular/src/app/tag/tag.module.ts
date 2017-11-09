import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TokenfieldModule } from '../tokenfield/tokenfield.module';

import { TagComponent } from './tag.component';
import { TagListComponent } from './tag-list.component';
import { TagService } from './tag.service';



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TokenfieldModule,
  ],
  declarations: [
    TagComponent,
    TagListComponent,
  ],
  providers: [
    TagService,
  ],
})
export class TagModule { }
