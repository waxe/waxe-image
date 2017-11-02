import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule }   from '@angular/router';

import { AppComponent, RedirectHomeComponent }  from './app.component';

import { CategoryModule } from './category/category.module';
import { CategoryListComponent } from './category/category-list.component';
import { FileListComponent } from './file/file-list.component';
import { FileModule } from './file/file.module';
import { TagListComponent } from './tag/tag-list.component';
import { TagModule } from './tag/tag.module';

import { CategoryService } from './category/category.service';
import { GroupService } from './group.service';
import { TagService } from './tag/tag.service';


@NgModule({
  imports:      [
    BrowserModule,
    HttpClientModule,
    CategoryModule,
    FileModule,
    TagModule,
    RouterModule.forRoot([
      {
        path: '',
        component: RedirectHomeComponent,
      },
      {
        path: 'g/:id/images',
        component: FileListComponent,
      },
      {
        path: 'categories',
        component: CategoryListComponent,
      },
      {
        path: 'tags',
        component: TagListComponent,
      }
    ]),
  ],
  providers: [
    CategoryService,
    GroupService,
    TagService,
  ],
  declarations: [ AppComponent, RedirectHomeComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
