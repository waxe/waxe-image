import { Component, OnInit } from '@angular/core';

import { ICategory } from './category';
import { CategoryService } from './category.service';


@Component({
  template: `
  <div class="container">
    <br>
    <br>
    <form class="form-inline" (submit)="addCategory(newCategory)">
      <input type="text" class="form-control" placeholder="Add category" #newCategory>
      <button type="submit" class="btn btn-primary">Add</button>
    </form>
    <br>
    <br>
    <ul class="list-group">
      <li class="list-group-item" *ngFor="let category of categories">
        <category [category]="category"></category>
      </li>
    </ul>
  </div>
  `,
})
export class CategoryListComponent implements OnInit {
  categories: ICategory[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.categoryService.getCategories(true).subscribe((categories: ICategory[]) => {
      this.categories = categories;
    });
  }

  addCategory(input: HTMLInputElement) {
    if (!input.value) return false;
    this.categoryService.create(input.value).then(() => {
      input.value = '';
      this.fetch();
    });
  }

}
