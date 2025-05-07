declare module 'multer' {
  namespace multer {
    interface File {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    }

    interface StorageEngine {
      _handleFile(
        req: import("express").Request,
        file: multer.File,
        callback: (error?: Error | null, info?: Partial<multer.File>) => void
      ): void;

      _removeFile(
        req: import("express").Request,
        file: multer.File,
        callback: (error: Error | null) => void
      ): void;
    }

    interface Options {
      storage?: StorageEngine;
      limits?: {
        fileSize?: number;
      };
    }

    function diskStorage(options: Record<string, unknown>): StorageEngine;

    function multer(options?: Options): import("express").RequestHandler;
  }

  export = multer;
}

export {};
