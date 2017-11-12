import { ITag } from '../tag/tag';


export interface IFile {
  id: number;
  rel_path: string;
  thumbnail_path: string;
  web_path: string;
  tags: ITag[];
}
