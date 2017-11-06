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
        <img [src]="file.webpath">
        <span *ngFor="let t of file.tags">{{t.name}}</span>
      </div>
      <div class="card-body">
        <p class="card-text">{{file.path}}</p>
        <tokenfield [(ngModel)]="tagsModel" (ngModelChange)="onChange($event)" [addToken]="addTag" [removeToken]="removeTag" placeholder="Add tag" [create]="create" [items]="tagService.getTags() | async"></tokenfield>
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
    this.file.tags = this.tagsModel.slice(0);
  }

  public addTag = this._addTag.bind(this);
  _addTag(tag: ITag) {
    return this.fileService.addTag(this.file, tag);
  }

  public removeTag = this._removeTag.bind(this);
  _removeTag(tag: ITag) {
    return this.fileService.removeTag(this.file, tag);
  }

  public create = this._create.bind(this);
  private _create(name: string) {
    return this.tagService.create(name);
  }

}
