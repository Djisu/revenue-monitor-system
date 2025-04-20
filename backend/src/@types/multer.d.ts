declare module 'multer' {
    import { RequestHandler } from 'express';
  
    interface MulterOptions {
      dest?: string;
      storage?: any;
      limits?: {
        fieldNameSize?: number;
        fieldSize?: number;
        fields?: number;
        fileSize?: number;
        files?: number;
        parts?: number;
        headerPairs?: number;
      };
      fileFilter?: (
        req: Express.Request,
        file: Express.Multer.File,
        callback: (error: Error | null, acceptFile: boolean) => void
      ) => void;
    }
  
    namespace Express {
      namespace Multer {
        interface File {
          /** Field name specified in the form */
          fieldname: string;
          /** Name of the file on the user's computer */
          originalname: string;
          /** Encoding type of the file */
          encoding: string;
          /** Mime type of the file */
          mimetype: string;
          /** Size of the file in bytes */
          size: number;
          /** The folder to which the file has been saved (DiskStorage) */
          destination: string;
          /** The name of the file within the destination */
          filename: string;
          /** Location of the uploaded file */
          path: string;
          /** A Buffer of the entire file (MemoryStorage) */
          buffer: Buffer;
        }
      }
    }
  
    interface Multer {
      single(fieldname: string): RequestHandler;
      array(fieldname: string, maxCount?: number): RequestHandler;
      fields(fields: { name: string; maxCount?: number }[]): RequestHandler;
      any(): RequestHandler;
      none(): RequestHandler;
    }
  
    function multer(options?: MulterOptions): Multer;
  
    export = multer;
  }
  