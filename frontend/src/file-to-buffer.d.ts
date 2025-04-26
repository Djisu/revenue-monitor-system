declare module 'file-to-buffer' {
    function fileToBuffer(file: File): Promise<Buffer>;
    export default fileToBuffer;
  }
  