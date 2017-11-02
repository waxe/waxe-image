import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

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
  <div class="container-fluid" infiniteScroll (scrolled)="onScroll()">
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
  matchingFiles: IFile[] = [];

  private increment: number = 100;
  private nb: number = 100;

  private inputValue: Observable<string>;

  @ViewChild('search') input: ElementRef;

  constructor(private route: ActivatedRoute, private fileService: FileService, public tagService: TagService) {}


  ngAfterViewInit() {
    this.inputValue = fromEvent(this.input.nativeElement, 'input', ($event) => $event.target.value);


    this.inputValue.debounceTime(200).subscribe((value: string) => {
      const re = new RegExp(value, 'gi');
      this.matchingFiles = this.allFiles.filter((file: IFile) => {
        return this.fileMatch(re, file);
      });
      this.nb = this.increment;
      this.files = this.matchingFiles.slice(0, this.nb);
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

    this.route.paramMap
      .switchMap((params: ParamMap) => this.fileService.getFiles(+params.get('id')))
      .subscribe((files: IFile[]) => {
        this.nb = this.increment;
        this.allFiles = files;
        this.matchingFiles = files;
        this.files = files.slice(0, this.nb);
    });
  }

  onScroll() {
    this.nb += this.increment;
    this.files = this.matchingFiles.slice(0, this.nb);
  }
}
