import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { fromEvent } from 'rxjs/observable/fromEvent';
import { Observable } from 'rxjs/Rx';

import { IFile } from './file';
import { ITag } from '../tag/tag';
import { FileService } from './file.service';
import { TagService } from '../tag/tag.service';


@Component({
  template: `
  <div class="container">
    <div class="row">
      <div class="col-sm-offset-2 col-sm-12">
        <br>
        <br>
        <input class="form-control" placeholder="search..." #search>
        <br>
      </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-2" *ngFor="let file of files">
        <file [file]="file"></file>
      </div>
    </div>
  </div>`,
})
export class FileListComponent implements AfterViewInit, OnInit {
  files: IFile[] = [];
  allFiles: IFile[] = [];

  private inputValue: Observable<string>;

  @ViewChild('search') input: ElementRef;

  constructor(private fileService: FileService, public tagService: TagService) {}


  ngAfterViewInit() {
    this.inputValue = fromEvent(this.input.nativeElement, 'input', ($event) => $event.target.value);


    this.inputValue.debounceTime(200).subscribe((value: string) => {
      const re = new RegExp(value, 'gi');
      this.files = this.allFiles.filter((file: IFile) => {
        return this.fileMatch(re, file);
      });
    });
  };

  fileMatch(re: RegExp, file: IFile) {
    if (re.test(file.path)) {
      return true;
    }

    const tags: ITag[] = file.tags.filter((tag: ITag) => {
      return re.test(tag.name);
    })

    if(tags.length) {
      return true;
    }
  }

  ngOnInit() {
    this.tagService.getTags(true).subscribe((tags: ITag[]) => {});

    this.fileService.getFiles().then((files: IFile[]) => {
      this.allFiles = files;
      this.files = files;
    });
  }
}
