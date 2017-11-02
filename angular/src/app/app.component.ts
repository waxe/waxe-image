import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { API_URLS } from './urls.service';
import { GroupService, IGroup } from './group.service';



@Component({
  template: '',
})
export class RedirectHomeComponent {
  constructor(private router: Router, private groupService: GroupService)  {
    this.groupService.getGroups().subscribe((groups: IGroup[]) => {
      this.router.navigate(['/g/'+ groups[0].id + '/images']);
    });
  }
}


@Component({
  selector: 'app-root',
  template: `
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Waxe image</a>
    <div class="collapse navbar-collapse">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item" routerLinkActive="active" *ngFor="let group of groups">
          <a class="nav-link" [routerLink]="'/g/' + group.id + '/images'">{{group.name}}</a>
        </li>
        <li class="nav-item" routerLinkActive="active">
          <a class="nav-link" routerLink="/tags">Tags</a>
        </li>
        <li class="nav-item" routerLinkActive="active">
          <a class="nav-link" routerLink="/categories">Categories</a>
        </li>
      </ul>
    </div>
  </nav>

  <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {

  public groups: IGroup[];

  constructor(private router: Router, private groupService: GroupService) {}


  ngOnInit() {
    this.groupService.getGroups().subscribe((groups: IGroup[]) => this.groups = groups);
  }
}
