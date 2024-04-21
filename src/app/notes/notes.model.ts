export interface Document {
    title: string
    text: string
    document: any
    keywords: string[]
    created: Date
    lastModified: Date
    user: string
    comments: string[]
    visibility?: boolean
}