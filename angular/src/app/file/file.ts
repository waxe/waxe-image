import { ITag } from '../tag';


export interface IFile {
  id: number;
  path: string;
  tags: ITag[];
}
