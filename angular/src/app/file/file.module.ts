import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FileComponent } from './file.component';
import { FileListComponent } from './file-list.component';

import { FileService } from './file.service';

import { InfiniteScrollDirective } from './scroll';

import { TokenfieldModule } from '../tokenfield/tokenfield.module';


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    TokenfieldModule,
  ],
  declarations: [
    FileComponent,
    FileListComponent,
    InfiniteScrollDirective,
  ],
  exports: [
    FileListComponent,
  ],
  providers: [
    FileService,
  ],
})
export class FileModule { }
