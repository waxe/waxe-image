import { Component, Input } from '@angular/core';

import { Observable, Subject } from 'rxjs/Rx';

import { IFile } from './file';
import { ITag } from '../tag/tag';
import { FileService } from './file.service';
import { TagService } from '../tag/tag.service';



@Component({
  selector: 'file',
  template: `
    <div class="card">
      <div class="card-img-top">
        <img [lazyLoad]="file.webpath">
      </div>
      <div class="card-body">
        <p class="card-text">{{file.path}}</p>
        <tokenfield [(ngModel)]="tagsModel" (ngModelChange)="onChange($event)" placeholder="Add tag" [create]="create" [items]="tagService.getTags() | async"></tokenfield>
      </div>
  </div>`,
})
export class FileComponent {

  private _file: IFile;
  public tagsModel: ITag[];

  public items: Subject<ITag[]>;

  @Input()
  set file(f) {
    this._file = f;
    this.tagsModel = f.tags.slice(0);
  }

  get file() {
    return this._file;
  }

  constructor(private fileService: FileService, public tagService: TagService) {}

  onChange(e: Event) {
    this.fileService.setTags(this.file, this.tagsModel).then((tags: ITag[]) => this.file.tags = tags);
  }

  public create = this._create.bind(this);
  private _create(name: string) {
    return this.tagService.create(name);
  }

}
