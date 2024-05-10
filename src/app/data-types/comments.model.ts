import { UserDocument } from "./user.model";

export interface SaveComment {
    documentId: number;
    text: string;
    userId: number;
}

export interface Comment {
    created: Date;
    documentId: number;
    id: number;
    text: string;
    user: UserDocument;
}

export interface UpdateComment {
    id: number;
    text: string;
}