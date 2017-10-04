import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import { Observable, ReplaySubject } from 'rxjs/Rx';

import { ITag, ITagsResponse } from '../tag/tag';
import { ICategory, ICategoriesResponse } from './category';

import { API_URLS } from '../urls.service';



@Injectable()
export class CategoryService {

  private categories: ReplaySubject<ICategory[]>;

  constructor(private http: HttpClient) { }

  getCategories(refresh: boolean=false): Observable<ICategory[]> {
    if (!this.categories || refresh) {
      this.categories = new ReplaySubject(1);
      this.fetch();
    }
    return this.categories;
  }

  fetch(): void {
    this.http.get<ICategoriesResponse>(API_URLS.categories.list)
               .toPromise()
               .then(response => this.categories.next(response.categories as ICategory[]));
  }

  create(name: string): Promise<ICategory> {
    return this.http.post(API_URLS.categories.list, {name})
               .toPromise()
               .then(response => {
                 this.fetch();
                 return response as ICategory
               });
  }

  setTags(category: ICategory, tags: ITag[]): Promise<ITag[]> {
    const url = API_URLS.categories.category.tags.supplant({'category.id': category.id});
    return this.http.post<ITagsResponse>(url, {tags})
               .toPromise()
               .then(res => res.tags as ITag[]);
  }
}
