import { Component, Input } from '@angular/core';

import { Observable, Subject } from 'rxjs/Rx';

import { ICategory } from './category';
import { ITag } from '../tag/tag';
import { CategoryService } from './category.service';
import { TagService } from '../tag/tag.service';



@Component({
  selector: 'category',
  template: `
    <h3>{{category.name}}</h3>
    <tokenfield [(ngModel)]="tagsModel" (ngModelChange)="onChange($event)" [addToken]="addTag" [removeToken]="removeTag" placeholder="Add tag" [create]="create" [items]="tagService.getTags() | async"></tokenfield>
  `,
})
export class CategoryComponent {

  private _category: ICategory;
  public tagsModel: ITag[];

  @Input()
  set category(f) {
    this._category = f;
    this.tagsModel = f.tags.slice(0);
  }

  get category() {
    return this._category;
  }

  constructor(private categoryService: CategoryService, public tagService: TagService) {}

  onChange(e: Event) {
    this.category.tags = this.tagsModel.slice(0);
  }

  public addTag = this._addTag.bind(this);
  _addTag(tag: ITag) {
    return this.categoryService.addTag(this.category, tag);
  }

  public removeTag = this._removeTag.bind(this);
  _removeTag(tag: ITag) {
    return this.categoryService.removeTag(this.category, tag);
  }

  public create = this._create.bind(this);
  private _create(name: string) {
    return this.tagService.create(name);
  }
}
