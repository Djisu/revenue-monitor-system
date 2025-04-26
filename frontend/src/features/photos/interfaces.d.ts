export interface StorePhotoResult {
    message: string;
    result: any;
}
export interface StorePhotoArgs {
    officer_no: string;
    photo: Buffer;
}
