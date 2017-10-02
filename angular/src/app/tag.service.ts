import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import { Observable, ReplaySubject } from 'rxjs/Rx';

import { ITag, ITagsResponse } from './tag';

import { API_URLS } from './urls.service';


@Injectable()
export class TagService {

  private tags: ReplaySubject<ITag[]>;

  constructor(private http: HttpClient) { }

  getTags(): Observable<ITag[]> {
    if (!this.tags) {
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
                    });
  }

}
