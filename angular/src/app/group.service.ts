import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import { Observable, ReplaySubject } from 'rxjs/Rx';

import { IFile } from './file/file';
import { API_URLS } from './urls.service';


export interface IGroup {
  id: number;
  name: string;
  file: IFile[];
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

}
