import { UserDocument } from './user.model';
import { File } from './file.model';

export interface GetEmployeeDocument {
  id: number;
  title: string;
  lastModified?: Date;
  user: UserDocument;
}
export interface EmployeeDocument {
  id: number;
  title: string;
  text: string;
  keywords: string;
  lastModified?: Date;
  comments?: string[];
  visibility?: boolean;
  user: UserDocument;
  file: File;
}

export interface SaveEmployeeDocument {
  id?: number;
  title: string;
  text: string;
  keywords: string;
  visibility: boolean;
  userId: number;
  file?: File;
}

export const newDocumentData = (d: EmployeeDocument): SaveEmployeeDocument => {
  const doc: SaveEmployeeDocument = {
    title: d.title,
    text: d.text,
    keywords: d.keywords,
    userId: d.user.id,
    visibility: d.visibility || false,
    file: d.file,
  };

  return doc;
};
