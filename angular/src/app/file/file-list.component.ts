import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { fromEvent } from 'rxjs/observable/fromEvent';
import { Observable, Subscription } from 'rxjs/Rx';

import { ICategory } from '../category/category';
import { IFile } from './file';
import { ITag } from '../tag/tag';
import { FileService } from './file.service';
import { TagService } from '../tag/tag.service';
import { CategoryService } from '../category/category.service';


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
  <div class="container-fluid" [infiniteScroll]="matchingFiles.length" (scrolled)="onScroll($event)">
    <div class="row">
      <div class="col-sm-2" *ngFor="let file of files">
        <file [file]="file"></file>
      </div>
    </div>
  </div>`,
})
export class FileListComponent implements AfterViewInit, OnDestroy, OnInit {
  files: IFile[] = [];
  private allFiles: IFile[] = [];
  public matchingFiles: IFile[] = [];
  private categories: ICategory[] = [];
  private tags: ITag[] = [];

  private tagSub: Subscription;
  private categorySub: Subscription;

  private initialNb = 30 * 6;

  private inputValue: Observable<string>;

  @ViewChild('search') input: ElementRef;

  constructor(private route: ActivatedRoute, private categoryService: CategoryService,
              private fileService: FileService, public tagService: TagService) {}


  ngAfterViewInit() {
    this.inputValue = fromEvent(this.input.nativeElement, 'input', ($event) => $event.target.value);


    this.inputValue.debounceTime(200).subscribe((value: string) => {
      if (value !== '') {
        const re = new RegExp(value, 'i');

        const matchingTags = this.tags.filter((tag: ITag) => re.test(tag.name));

        this.categories
             .filter((category: ICategory) => re.test(category.name))
             .map((category: ICategory) => category.tags.filter((t: ITag) => {
               if (matchingTags.indexOf(t) === -1) {
                 matchingTags.push(t);
               }
             }));

        this.matchingFiles = this.allFiles.filter((file: IFile) => {
          return this.fileMatch(re, file, matchingTags.map((tag: ITag) => tag.id));
        });
      } else {
        this.matchingFiles = this.allFiles;
      }
      this.files = this.matchingFiles.slice(0, this.initialNb);
    });
  }

  fileMatch(re: RegExp, file: IFile, matchingTagIds: number[]) {
    if (re.test(file.rel_path)) {
      return true;
    }

    for (const tag of file.tags) {
      if (matchingTagIds.indexOf(tag.id) !== -1) {
        return true;
      }
    }
  }

  ngOnInit() {
    this.tagSub = this.tagService.getTags(true).subscribe((tags: ITag[]) => {
      this.tags = tags;
    });
    this.categorySub = this.categoryService.getCategories(true).subscribe((categories: ICategory[]) => {
      this.categories = categories;
    });

    this.route.paramMap
      .switchMap((params: ParamMap) => this.fileService.getFiles(+params.get('id')))
      .subscribe((files: IFile[]) => {
        // Empty the search
        this.input.nativeElement.value = '';
        this.allFiles = files;
        this.matchingFiles = files;
        this.files = files.slice(0, this.initialNb);
    });
  }

  ngOnDestroy() {
    this.tagSub.unsubscribe();
    this.categorySub.unsubscribe();
  }

  onScroll(data: {}) {
    this.files = this.matchingFiles.slice(data['start'], data['end']);
  }
}
