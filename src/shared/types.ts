export interface Note {
    id: string;
    title: string;
    content: string;
    folderId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Folder {
    id: string;
    name: string;
    parentId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateNoteRequest {
    title: string;
    content?: string;
    folderId?: string;
}

export interface UpdateNoteRequest {
    id: string;
    title?: string;
    content?: string;
    folderId?: string;
}

export interface CreateFolderRequest {
    name: string;
    parentId?: string;
}

export interface UpdateFolderRequest {
    id: string;
    name?: string;
    parentId?: string;
}

export interface SearchResult {
    type: 'note' | 'folder';
    id: string;
    title: string;
    excerpt?: string;
    folderId?: string;
}