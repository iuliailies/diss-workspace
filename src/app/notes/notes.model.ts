export interface Document {
    id?: number
    title: string
    text: string
    document?: any
    keywords: string
    created?: Date
    lastModified: Date
    userId: number
    comments?: string[]
    visibility?: boolean
}

export interface CreateDocumentRequest {
    title: string
    text: string
    document: any
    keywords: string
    lastModified: Date
    userId: number
    visibility: boolean
}

export const newDocumentData = (d: Document): CreateDocumentRequest => {
    const doc: CreateDocumentRequest = {
        title: d.title,
        text: d.text,
        document: d.document,
        keywords: d.keywords,
        lastModified: new Date(),
        userId: d.userId,
        visibility: d.visibility || false
    };
  
    return doc;
  };
  