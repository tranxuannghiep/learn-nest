import { UserDBEntity } from 'src/userDB/userDB.entity';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: UserDBEntity;
  }
}
