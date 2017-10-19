import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Waxe image</a>
    <div class="collapse navbar-collapse">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          <a class="nav-link" routerLink="/">Images</a>
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

  <div class="container">
    <router-outlet></router-outlet>
  </div>
  `,
})
export class AppComponent {}
