import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
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
    StoreModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'user',
      password: '123456789',
      database: 'test',
      entities: [UserDBEntity],
      synchronize: true,
    }),
    UserDBModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
