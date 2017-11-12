import { Component, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable, Subject } from 'rxjs/Rx';

import { IFile } from './file';
import { ITag } from '../tag/tag';
import { FileService } from './file.service';
import { TagService } from '../tag/tag.service';



@Component({
  selector: 'file',
  template: `
   <ng-template #content let-d="dismiss">
     <div class="modal-header">
       <h4 class="modal-title">{{file.rel_path}}</h4>
       <button type="button" class="close" aria-label="Close" (click)="d()">
         <span aria-hidden="true">&times;</span>
       </button>
     </div>
     <div class="modal-body">
      <div class="container">
        <div class="row small">
          <div class="col-sm-6">
            Created on {{file.creation_date | date:'MMM dd, y hh:mm a'}} by {{file.creation_author}}
          </div>
          <div class="col-sm-6">
            Modified on {{file.modification_date | date:'MMM dd, y hh:mm a'}} by {{file.modification_author}}
          </div>
        </div>
      </div>
      <br class="small">
      <div class="text-center">
        <img [src]="file.web_path">
      </div>
     </div>
   </ng-template>

    <div class="card">
      <div class="card-img-top">
        <img [src]="file.thumbnail_path" (click)="open(content)">
      </div>
      <div class="card-body">
        <p class="card-text text-center">{{file.rel_path}}</p>
        <tokenfield [(ngModel)]="tagsModel" (ngModelChange)="onChange($event)" [addToken]="addTag" [removeToken]="removeTag" placeholder="Add tag" [create]="create" [items]="tagService.getTags() | async"></tokenfield>
        <div class="text-right small"><a [href]="file.web_path" target="_blank">Link</a></div>
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

  constructor(public modalService: NgbModal, private fileService: FileService, public tagService: TagService) {}

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

  open(content) {
    this.modalService.open(content, {'size': 'lg'});
  }

}
