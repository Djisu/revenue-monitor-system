// src/types/globals.d.ts
export {}; // Needed to make this a module

declare global {
  interface Window {
    process?: {
      env: {
        NODE_ENV: 'development' | 'production' | 'test';
        [key: string]: string | undefined;
      };
    };
  }
}

  