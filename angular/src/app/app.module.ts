import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule }   from '@angular/router';

import { AppComponent }  from './app.component';

import { CategoryModule } from './category/category.module';
import { CategoryListComponent } from './category/category-list.component';
import { FileListComponent } from './file/file-list.component';
import { FileModule } from './file/file.module';

import { TagService } from './tag.service';


@NgModule({
  imports:      [
    BrowserModule,
    HttpClientModule,
    CategoryModule,
    FileModule,
    RouterModule.forRoot([
      {
        path: '',
        component: FileListComponent,
      },
      {
        path: 'categories',
        component: CategoryListComponent,
      }
    ]),
  ],
  providers: [
    TagService,
  ],
  declarations: [ AppComponent],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
