import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import { Observable, ReplaySubject } from 'rxjs/Rx';

import { ITag, ITagsResponse } from './tag';
import { ICategory, ICategoryResponse, ICategoriesResponse } from '../category/category';

import { API_URLS } from '../urls.service';


@Injectable()
export class TagService {

  private tags: ReplaySubject<ITag[]>;

  constructor(private http: HttpClient) { }

  getTags(refresh: boolean=false): Observable<ITag[]> {
    if (!this.tags || refresh) {
      this.tags = new ReplaySubject(1);
      this.fetch();
    }
    return this.tags;
  }

  fetch(): void {
    this.http.get<ITagsResponse>(API_URLS.tags.list)
             .toPromise()
             .then(response => this.tags.next(response.tags as ITag[]));
  }

  create(name: string): Promise<ITag> {
    return this.http.post(API_URLS.tags.list, {name})
                    .toPromise().then(response => {
                      this.fetch();
                      return response as ITag;
                    }).catch((res) => {
                      // NOTE: should be parsed in angular 5
                      // https://github.com/cwayfinder/angular/commit/d2ba570981b2763dcf25ae71888aa479fe385f0d
                      return Promise.reject(JSON.parse(res['error']));
                    });
  }

  addCategory(tag: ITag, category: ICategory): Promise<ICategory> {
    const url = API_URLS.tags.tag.category.supplant({'tag.id': tag.id, 'category.id': category.id});
    return this.http.put<ICategoryResponse>(url, {})
               .toPromise()
               .then(res => {
                 return res.category as ICategory;
               }).catch(res => {
                 if (res.status === 409) {
                   // Someone else already added the tag, just add it
                   const error: {} = JSON.parse(res['error']);
                   return Promise.resolve(error['category'] as ICategory);
                 }
                 return Promise.reject(null);
               });
  }

  removeCategory(tag: ITag, category: ICategory): Promise<void> {
    const url = API_URLS.tags.tag.category.supplant({'tag.id': tag.id, 'category.id': category.id});
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
