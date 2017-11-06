import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { IFile } from './file';
import { ITag, ITagResponse, ITagsResponse } from '../tag/tag';

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

  addTag(file: IFile, tag: ITag): Promise<ITag> {
    const url = API_URLS.files.file.tag.supplant({'file.id': file.id, 'tag.id': tag.id});
    return this.http.put<ITagResponse>(url, {})
               .toPromise()
               .then(res => {
                 return res.tag as ITag;
               });
  }

  removeTag(file: IFile, tag: ITag): Promise<void> {
    const url = API_URLS.files.file.tag.supplant({'file.id': file.id, 'tag.id': tag.id});
    return this.http.delete(url)
               .toPromise()
               .then(res => {});
  }
}
