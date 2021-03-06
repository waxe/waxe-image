import { ICategory } from '../category/category';

export interface ITag {
  id: number;
  name: string;
  categories: ICategory[];
}


export interface ITagResponse {
  tag: ITag;
}


export interface ITagsResponse {
  tags: ITag[];
}
