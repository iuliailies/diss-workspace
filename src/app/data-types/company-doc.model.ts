import { UserDocument } from './user.model';
import { File } from './file.model';

export interface GetCompanyDocument {
  id: number;
  title: string;
  lastModified?: Date;
  user: UserDocument;
}
export interface CompanyDocument {
  id: number;
  title: string;
  text: string;
  keywords: string;
  lastModified?: Date;
  comments?: string[];
  user: UserDocument;
  file: File;
}

export interface SaveCompanyDocument {
  id?: number;
  title: string;
  text: string;
  keywords: string;
  userId: number;
  file?: File;
}

export const newDocumentData = (d: CompanyDocument): SaveCompanyDocument => {
  const doc: SaveCompanyDocument = {
    title: d.title,
    text: d.text,
    keywords: d.keywords,
    userId: d.user.id,
    file: d.file,
  };

  return doc;
};
