import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BookEntity } from './books/book.entity';
import { BookModule } from './books/book.module';
import { PostModule } from './posts/post.module';
import { StoreModule } from './store/store.module';
import { UserDBEntity } from './userDB/userDB.entity';
import { UserDBModule } from './userDB/userDB.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    UserModule,
    PostModule,
    AuthModule,
    BookModule,
    StoreModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'user',
      password: '123456789',
      database: 'test',
      entities: [UserDBEntity, BookEntity],
      synchronize: true,
    }),
    UserDBModule,
  ],
})
export class AppModule {}
