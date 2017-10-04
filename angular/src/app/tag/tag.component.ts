import { Component, Input } from '@angular/core';

import { Observable, Subject } from 'rxjs/Rx';

import { ICategory } from '../category/category';
import { ITag } from './tag';
import { CategoryService } from '../category/category.service';
import { TagService } from './tag.service';



@Component({
  selector: 'tag',
  template: `
    <h3>{{tag.name}}</h3>
    <tokenfield [(ngModel)]="categoriesModel" (ngModelChange)="onChange($event)" placeholder="Add cat" [create]="create" [items]="categoryService.getCategories() | async"></tokenfield>
  `,
})
export class TagComponent {

  private _tag: ITag;
  public categoriesModel: ICategory[];

  @Input()
  set tag(f) {
    this._tag = f;
    this.categoriesModel = f.categories.slice(0);
  }

  get tag() {
    return this._tag;
  }

  constructor(public categoryService: CategoryService, public tagService: TagService) {}

  onChange(e: Event) {
    this.tagService.setCategories(this.tag, this.categoriesModel).then((categories: ICategory[]) => this.tag.categories = categories);
  }


  public create = this._create.bind(this);
  private _create(name: string) {
    return this.categoryService.create(name);
  }

}
