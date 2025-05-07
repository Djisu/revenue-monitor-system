export interface StorePhotoResult {
    message: string;
    result: string;
}
export interface StorePhotoArgs {
    officer_no: string;
    photo: Buffer;
}
