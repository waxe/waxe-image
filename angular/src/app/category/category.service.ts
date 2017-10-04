import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { ICategory, ICategoriesResponse } from './category';

import { API_URLS } from '../urls.service';



@Injectable()
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(): Promise<ICategory[]> {
    return this.http.get<ICategoriesResponse>(API_URLS.categories.list)
               .toPromise()
               .then(response => response.categories as ICategory[]);
  }

  create(name: string): Promise<ICategory> {
    return this.http.post(API_URLS.categories.list, {name})
               .toPromise()
               .then(response => response as ICategory);
  }

  setTags(category: ICategor, tags: ITag[]): Promise<ITag[]> {
    const url = API_URLS.categories.category.tags.supplant({'category.id': category.id});
    return this.http.post<ICategoriesResponse>(url, {tags})
               .toPromise()
               .then(res => res.tags as ITag[]);
  }
}
