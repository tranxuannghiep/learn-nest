import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './posts/post.module';
import { StoreModule } from './store/store.module';
import { UserDBEntity } from './userDB/userDB.entity';
import { UserDBModule } from './userDB/userDB.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    UserModule,
    PostModule,
    StoreModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Anhnghiep1',
      database: 'test',
      entities: [UserDBEntity],
      synchronize: true,
    }),
    UserDBModule,
  ],
})
export class AppModule {}
