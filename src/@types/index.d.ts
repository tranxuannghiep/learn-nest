import { UserEntity } from 'src/user/user.entity';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: UserEntity;
  }
}
