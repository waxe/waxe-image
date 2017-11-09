import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ITag } from './tag';
import { TagService } from './tag.service';


@Component({
  template: `
  <div class="container">
    <br>
    <br>
    <form (submit)="addTag()" [formGroup]="tagForm" novalidate>
      <div class="form-inline">
        <input type="text" class="form-control" placeholder="Add tag" formControlName="name">
        <button type="submit" class="btn btn-primary" [disabled]="tagForm.invalid">Add</button>
      </div>
      <span *ngIf="name.invalid && name.dirty" class="invalid">
        <div *ngIf="name.errors.required">Name is required.</div>
        <div *ngIf="name.errors.existName">'{{name.errors.existName.value}}' already exists.</div>
      </span>
    </form>
    <br>
    <br>
    <ul class="list-group">
      <li class="list-group-item" *ngFor="let tag of tags">
        <tag [tag]="tag"></tag>
      </li>
    </ul>
  </div>
  `,
})
export class TagListComponent implements OnInit {
  tags: ITag[] = [];
  tagForm: FormGroup;

  get name() { return this.tagForm.get('name'); }

  constructor(private fb: FormBuilder, private tagService: TagService) {
    this.createForm();
  }

  createForm() {
    this.tagForm = this.fb.group({
      name: ['', [Validators.required, this.existNameValidator.bind(this)]],
    });
  }

  existNameValidator(control: AbstractControl): {[key: string]: any} {
    const tags: ITag[] = this.tags.filter((tag: ITag) => tag.name === control.value);
    return tags.length ? {'existName': {value: control.value}} : null;
  }

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.tagService.getTags(true).subscribe((tags: ITag[]) => {
      this.tags = tags;
    });
  }

  addTag() {
    if (this.tagForm.invalid) {
      return;
    }
    const tagname = this.tagForm.value.name;
    this.tagService.create(tagname).then((res) => {
      this.tagForm.reset();
      this.fetch();
    }).catch((res) => {
      if (res.errors.name.existName) {
        // If existNameValidator has validated the name someone else had
        // already add the tag
        this.fetch();
      }
      this.name.setErrors(res.errors.name);
    });
  }

}
