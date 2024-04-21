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