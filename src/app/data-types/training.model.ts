import { UserDocument } from './user.model';
import { File } from './file.model';
import { Badge } from './badge.model';

export interface GetTrainingDocument {
  id: number;
  title: string;
  text: string;
  reward: number;
  requiredLevel: number;
  user: UserDocument;
}
export interface TrainingDocument {
  id: number;
  title: string;
  text: string;
  keywords: string;
  lastModified?: Date;
  reward: number;
  requiredLevel: number;
  totalPages: number;
  user: UserDocument;
  file: File;
}

export interface SaveTrainingDocument {
  id?: number;
  title: string;
  text: string;
  keywords: string;
  reward: number;
  requiredLevel: number;
  totalPages: number;
  userId: number;
  file?: File;
}

export interface ViewTrainingDocument {
  id: number;
  title: string;
  text: string;
  reward: number;
  totalPages: number;
  user: UserDocument;
  file: File;
  badge: Badge;
}

export interface StartTrainingDocument {
  trainingId: number;
  userId: number;
}
