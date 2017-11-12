import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ICategory } from './category';
import { CategoryService } from './category.service';


@Component({
  template: `
  <div class="container">
    <br>
    <br>
    <form (submit)="addCategory()" [formGroup]="categoryForm" novalidate>
      <div class="form-inline">
        <input type="text" class="form-control" placeholder="Add category" formControlName="name">
        <button type="submit" class="btn btn-primary" [disabled]="categoryForm.invalid">Add</button>
      </div>
      <span *ngIf="name.invalid && name.dirty" class="invalid">
        <div *ngIf="name.errors.required">Name is required.</div>
        <div *ngIf="name.errors.existName">'{{name.errors.existName.value}}' already exists.</div>
      </span>
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
  categoryForm: FormGroup;

  get name() { return this.categoryForm.get('name'); }

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    this.createForm();
  }

  createForm() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, this.existNameValidator.bind(this)]],
    });
  }

  existNameValidator(control: AbstractControl): {[key: string]: any} {
    const cats: ICategory[] = this.categories.filter((cat: ICategory) => cat.name === control.value);
    return cats.length ? {'existName': {value: control.value}} : null;
  }

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.categoryService.getCategories(true).subscribe((categories: ICategory[]) => {
      this.categories = categories;
    });
  }

  addCategory() {
    if (this.categoryForm.invalid) {
      return;
    }
    const catname = this.categoryForm.value.name;
    this.categoryService.create(catname).then((res) => {
      this.categoryForm.reset();
      this.fetch();
    }).catch((res) => {
      if (res.errors.name.existName) {
        // If existNameValidator has validated the name someone else had
        // already add the category
        this.fetch();
      }
      this.name.setErrors(res.errors.name);
    });
  }
}
