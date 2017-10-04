import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';

import { TokenfieldModule } from '../tokenfield/tokenfield.module';

import { CategoryComponent } from './category.component';
import { CategoryListComponent } from './category-list.component';
import { CategoryService } from './category.service';



@NgModule({
  imports: [
    CommonModule,
    TokenfieldModule,
  ],
  declarations: [
    CategoryComponent,
    CategoryListComponent,
  ],
  providers: [
    CategoryService,
  ],
})
export class CategoryModule { }
