import { ITag } from '../tag/tag';


export interface IFile {
  id: number;
  path: string;
  webpath: string;
  tags: ITag[];
}
