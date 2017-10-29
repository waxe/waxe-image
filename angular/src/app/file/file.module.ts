import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FileComponent } from './file.component';
import { FileListComponent } from './file-list.component';

import { FileService } from './file.service';

import { TokenfieldModule } from '../tokenfield/tokenfield.module';


@NgModule({
  imports: [
    CommonModule,
    InfiniteScrollModule,
    NgbModule,
    TokenfieldModule,
  ],
  declarations: [
    FileComponent,
    FileListComponent,
  ],
  exports: [
    FileListComponent,
  ],
  providers: [
    FileService,
  ],
})
export class FileModule { }
