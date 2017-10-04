import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';

import { TokenfieldModule } from '../tokenfield/tokenfield.module';

import { TagComponent } from './tag.component';
import { TagListComponent } from './tag-list.component';
import { TagService } from './tag.service';



@NgModule({
  imports: [
    CommonModule,
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
