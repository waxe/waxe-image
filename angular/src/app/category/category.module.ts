import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';

import { TokenfieldModule } from '../tokenfield/tokenfield.module';

import { CategoryComponent } from './category.component';
import { CategoryListComponent } from './category-list.component';


@NgModule({
  imports: [
    CommonModule,
    TokenfieldModule,
  ],
  declarations: [
    CategoryComponent,
    CategoryListComponent,
  ],
})
export class CategoryModule { }
