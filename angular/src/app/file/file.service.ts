import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { IFile } from './file';
import { ITag, ITagsResponse } from '../tag/tag';

import { API_URLS } from '../urls.service';


interface IFilesResponse {
  files: IFile[];
}


@Injectable()
export class FileService {

  constructor(private http: HttpClient) { }

  getFiles(groupId: number): Promise<IFile[]> {
    const url = API_URLS.files.list.supplant({'groupId': groupId});
    return this.http.get<IFilesResponse>(url)
               .toPromise()
               .then(response => response.files as IFile[]);
  }

  setTags(file: IFile, tags: ITag[]): Promise<ITag[]> {
    const url = API_URLS.files.file.tags.supplant({'file.id': file.id});
    return this.http.post<ITagsResponse>(url, {tags})
               .toPromise()
               .then(res => res.tags as ITag[]);
  }
}
