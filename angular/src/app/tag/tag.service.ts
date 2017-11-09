import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import { Observable, ReplaySubject } from 'rxjs/Rx';

import { ITag, ITagsResponse } from './tag';
import { ICategory, ICategoriesResponse } from '../category/category';

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

  setCategories(tag: ITag, categories: ICategory[]): Promise<ICategory[]> {
    const url = API_URLS.tags.tag.categories.supplant({'tag.id': tag.id});
    return this.http.post<ICategoriesResponse>(url, {categories})
               .toPromise()
               .then(res => res.categories as ICategory[]);
  }

}
