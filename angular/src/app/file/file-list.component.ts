import { Component, OnInit } from '@angular/core';

import { IFile } from './file';
import { ITag } from '../tag/tag';
import { FileService } from './file.service';
import { TagService } from '../tag/tag.service';


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

  constructor(private fileService: FileService, private tagService: TagService) {}

  ngOnInit() {
    this.tagService.getTags(true).subscribe((tags: ITag[]) => {});

    this.fileService.getFiles().then((files: IFile[]) => {
      this.files= files;
    });
  }

}
