export interface FileUpload {
    id: string;
    filename: string;
    size: number;
    mimeType: string;
    pin: string;
    createdAt: Date;
}

export interface FileDownload {
    id: string;
    filename: string;
    size: number;
    mimeType: string;
}

export interface Pin {
    value: string;
    expiresAt: Date;
}