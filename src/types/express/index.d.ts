import { IUSER } from '../../schema/userSchema.ts';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      token?: string;
    }
  }
}