import { Component, Input } from '@angular/core';

import { Observable, Subject } from 'rxjs/Rx';

import { ICategory } from './category';
import { ITag } from '../tag';
import { CategoryService } from './category.service';
import { TagService } from '../tag.service';



@Component({
  selector: 'category',
  template: `
    <h3>{{category.name}}</h3>
    <tokenfield [(ngModel)]="tagsModel" (ngModelChange)="onChange($event)" [items]="tagService.getTags() | async"></tokenfield>
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
    this.categoryService.setTags(this.category, this.tagsModel).then((tags: ITag[]) => this.category.tags = tags);
  }

}
