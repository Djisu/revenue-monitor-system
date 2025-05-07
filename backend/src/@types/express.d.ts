// src/@types/express.d.ts

declare global {
    namespace Express {
      interface Request {
        user?: {
          isVerified?: boolean;
          id: string;
          username: string;
          email: string;
          role: string;
          avatar: string;
        };
        member?: {
          id: string;
          username: string;
          firstName: string;
          lastName: string;
          email: string;
          phone: string;
          address: string;
          membership_type: string;
          affiliated: string;
          password: string;
          role: string;
        };
      }
    }
  }
  
  export {};
  