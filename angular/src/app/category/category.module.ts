import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TokenfieldModule } from '../tokenfield/tokenfield.module';

import { CategoryComponent } from './category.component';
import { CategoryListComponent } from './category-list.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    TokenfieldModule,
  ],
  declarations: [
    CategoryComponent,
    CategoryListComponent,
  ],
})
export class CategoryModule { }
