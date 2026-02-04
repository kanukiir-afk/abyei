import 'express';

declare module 'express' {
  interface Request {
    file?: any;
    files?: any;
  }
}
