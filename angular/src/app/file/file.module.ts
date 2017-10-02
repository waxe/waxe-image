import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FileComponent } from './file.component';
import { FileListComponent } from './file-list.component';

import { FileService } from './file.service';

import { TokenfieldComponent } from '../tokenfield.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
  ],
  declarations: [
    FileComponent,
    FileListComponent,
    TokenfieldComponent,
  ],
  exports: [
    FileListComponent,
  ],
  providers: [
    FileService,
  ],
})
export class FileModule { }
