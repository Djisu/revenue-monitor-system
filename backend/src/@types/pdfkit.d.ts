// src/@types/pdfkit.d.ts
declare module 'pdfkit' {
    import { Stream } from 'stream';
  
    interface TextOptions {
      align?: 'left' | 'center' | 'right' | 'justify';
      width?: number;
      height?: number;
      ellipsis?: boolean | string;
      continued?: boolean;
      lineBreak?: boolean;
      paragraphGap?: number;
      indent?: number;
      columns?: number;
      columnGap?: number;
    }
  
    class PDFDocument {
      constructor(options?: unknown);
      pipe(stream: Stream): void;
      text(text: string, options?: TextOptions): this;
      text(text: string, x: number, y: number, options?: TextOptions): this;
      fontSize(size: number): this;
      moveDown(lines?: number): this;
      moveTo(x: number, y: number): this;
      lineTo(x: number, y: number): this;
      stroke(): this;
      image(src: string, x: number, y: number, options?: { width?: number; height?: number }): this;
      fillColor(color: string): this;
      end(): void;
      on(event: 'data', callback: (chunk: Buffer) => void): void;
      on(event: 'end', callback: () => void): void;
      on(event: 'error', callback: (err: Error) => void): void;
      y: number; 
      page: { width: number; height: number };
    }
  
    export default PDFDocument;
  }
  
  
  

  