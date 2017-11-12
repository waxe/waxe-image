import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import { Observable, ReplaySubject } from 'rxjs/Rx';

import { ITag, ITagResponse, ITagsResponse } from '../tag/tag';
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
               }).catch((res) => {
                 // NOTE: should be parsed in angular 5
                 // https://github.com/cwayfinder/angular/commit/d2ba570981b2763dcf25ae71888aa479fe385f0d
                 return Promise.reject(JSON.parse(res['error']));
               });
  }

  addTag(category: ICategory, tag: ITag): Promise<ITag> {
    const url = API_URLS.categories.category.tag.supplant({'category.id': category.id, 'tag.id': tag.id});
    return this.http.put<ITagResponse>(url, {})
               .toPromise()
               .then(res => {
                 return res.tag as ITag;
               }).catch(res => {
                 if (res.status === 409) {
                   // Someone else already added the tag, just add it
                   const error: {} = JSON.parse(res['error']);
                   return Promise.resolve(error['tag'] as ITag);
                 }
                 return Promise.reject(null);
               });
  }

  removeTag(category: ICategory, tag: ITag): Promise<void> {
    const url = API_URLS.categories.category.tag.supplant({'category.id': category.id, 'tag.id': tag.id});
    return this.http.delete(url)
               .toPromise()
               .then(res => {})
               .catch(res => {
                  if (res.status === 404) {
                   // Someone else already removed the tag, just remove it
                    return Promise.resolve();
                  }
                  return Promise.reject(null);
               });
  }
}
