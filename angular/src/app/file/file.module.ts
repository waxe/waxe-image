import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FileComponent } from './file.component';
import { FileListComponent } from './file-list.component';

import { FileService } from './file.service';

import { TokenfieldModule } from '../tokenfield/tokenfield.module';


@NgModule({
  imports: [
    CommonModule,
    LazyLoadImageModule,
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
