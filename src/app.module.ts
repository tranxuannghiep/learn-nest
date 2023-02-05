import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BookEntity } from './books/book.entity';
import { BookModule } from './books/book.module';
import { CategoryEntity } from './categories/category.entity';
import { CategoryModule } from './categories/category.module';
import { PostModule } from './posts/post.module';
import { StoreModule } from './store/store.module';
import { UserDBEntity } from './userDB/userDB.entity';
import { UserDBModule } from './userDB/userDB.module';
import { UserModule } from './users/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    PostModule,
    UserDBModule,
    AuthModule,
    BookModule,
    CategoryModule,
    StoreModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      entities: [UserDBEntity, BookEntity, CategoryEntity],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
