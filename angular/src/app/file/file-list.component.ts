import { Component, OnInit } from '@angular/core';

import { IFile } from './file';
import { FileService } from './file.service';


@Component({
  template: `
  <div class="row">
    <div class="col-sm-3" *ngFor="let file of files">
      <file [file]="file"></file>
    </div>
  </div>`,
})
export class FileListComponent implements OnInit {
  files: IFile[] = [];

  constructor(private fileService: FileService) {}

  ngOnInit() {
    this.fileService.getFiles().then((files: IFile[]) => {
      this.files= files;
    });
  }

}
