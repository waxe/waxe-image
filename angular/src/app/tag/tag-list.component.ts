import { Component, OnInit } from '@angular/core';

import { ITag } from './tag';
import { TagService } from './tag.service';


@Component({
  template: `
  <br>
  <br>
  <form class="form-inline" (submit)="addTag(newTag)">
    <input type="text" class="form-control" placeholder="Add tag" #newTag>
    <button type="submit" class="btn btn-primary">Add</button>
  </form>
  <br>
  <br>
  <ul class="list-group">
    <li class="list-group-item" *ngFor="let tag of tags">
      <tag [tag]="tag"></tag>
    </li>
  </ul>
  `,
})
export class TagListComponent implements OnInit {
  tags: ITag[] = [];

  constructor(private tagService: TagService) {}

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.tagService.getTags(true).subscribe((tags: ITag[]) => {
      this.tags = tags;
    });
  }

  addTag(input: HTMLInputElement) {
    if (!input.value) return false;
    this.tagService.create(input.value).then(() => {
      input.value = '';
      this.fetch();
    });
  }

}
