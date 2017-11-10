import { ITag } from '../tag/tag';


export interface ICategory {
  id: number;
  name: string;
  tags: ITag[];
}


export interface ICategoryResponse {
  category: ICategory;
}


export interface ICategoriesResponse {
  categories: ICategory[];
}
