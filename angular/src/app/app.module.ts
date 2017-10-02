import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent }  from './app.component';

import { FileModule } from './file/file.module';

import { TagService } from './tag.service';


@NgModule({
  imports:      [
    BrowserModule,
    HttpClientModule,
    FileModule,
  ],
  providers: [
    TagService,
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
