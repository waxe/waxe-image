import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import { Observable, ReplaySubject } from 'rxjs/Rx';

import { IFile } from './file/file';
import { API_URLS } from './urls.service';


export interface IGroup {
  id: number;
  name: string;
  abs_path:string;
  web_path: string;
  thumbnail_path: string;
  file?: IFile[];
}


export interface IGroupsResponse {
  groups: IGroup[];
}


@Injectable()
export class GroupService {

  private groups: ReplaySubject<IGroup[]>;

  constructor(private http: HttpClient) { }

  getGroups(): Observable<IGroup[]> {
    if (!this.groups) {
      this.groups = new ReplaySubject(1);
      this.fetch();
    }
    return this.groups;
  }

  fetch(): void {
    this.http.get<IGroupsResponse>(API_URLS.groups.list)
             .toPromise()
             .then(response => this.groups.next(response.groups as IGroup[]));
  }

  createGroup(group: IGroup) {
    const url = API_URLS.groups.list;
    return this.http.post(url, group)
               .toPromise()
               .then(() => {
                 this.fetch();
               }).catch((res) => {
                 // NOTE: should be parsed in angular 5
                 // https://github.com/cwayfinder/angular/commit/d2ba570981b2763dcf25ae71888aa479fe385f0d
                 return Promise.reject(JSON.parse(res['error']));
               });
  }

  updateGroup(group: IGroup) {
    const url = API_URLS.groups.group.supplant({'group.id': group.id});
    return this.http.put(url, group)
               .toPromise()
               .then(() => {
                 this.fetch();
               }).catch((res) => {
                 // NOTE: should be parsed in angular 5
                 // https://github.com/cwayfinder/angular/commit/d2ba570981b2763dcf25ae71888aa479fe385f0d
                 return Promise.reject(JSON.parse(res['error']));
               });
  }

}
