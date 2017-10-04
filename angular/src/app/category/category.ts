import { ITag } from '../tag';


export interface ICategory {
  id: number;
  name: string;
  tags: ITag[];
}


export interface ICategoriesResponse {
  categories: ICategory[];
}
