import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule }   from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent, RedirectHomeComponent }  from './app.component';

import { CategoryModule } from './category/category.module';
import { CategoryListComponent } from './category/category-list.component';
import { FileListComponent } from './file/file-list.component';
import { FileModule } from './file/file.module';
import { MessageComponent, MessageService } from './message';
import { TagListComponent } from './tag/tag-list.component';
import { TagModule } from './tag/tag.module';
import { SettingsComponent } from './settings/settings.component';
import { SettingsModule } from './settings/settings.module';

import { CategoryService } from './category/category.service';
import { GroupService } from './group.service';
import { TagService } from './tag/tag.service';

import { ErrorInterceptor } from './http';


@NgModule({
  imports:      [
    BrowserModule,
    HttpClientModule,
    NgbModule.forRoot(),
    CategoryModule,
    FileModule,
    TagModule,
    SettingsModule,
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
      },
      {
        path: 'settings',
        component: SettingsComponent,
      }
    ]),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    CategoryService,
    GroupService,
    MessageService,
    TagService,
  ],
  declarations: [ AppComponent, MessageComponent, RedirectHomeComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
