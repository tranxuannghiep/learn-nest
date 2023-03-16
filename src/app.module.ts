import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BookEntity } from './books/book.entity';
import { BookModule } from './books/book.module';
import { CategoryEntity } from './categories/category.entity';
import { CategoryModule } from './categories/category.module';
import { UserEntity } from './users/user.entity';
import { UserModule } from './users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { OrderModule } from './orders/order.module';
import { OrderEntity } from './orders/order.entity';
import { OrderDetailEntity } from './orders/order-detail.entity';
import appConfig from './config/app.config';
import * as redisStore from 'cache-manager-redis-store';
import { BullModule } from '@nestjs/bull';
import { SocketModule } from './socket/socket.module';
import { RoomEntity } from './socket/rooms/room.entity';
import { MessageEntity } from './socket/messages/message.entity';
import { RoomModule } from './socket/rooms/room.module';
import { MessageModule } from './socket/messages/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    UserModule,
    AuthModule,
    BookModule,
    CategoryModule,
    OrderModule,
    SocketModule,
    RoomModule,
    MessageModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get<number>('database.port', 3306),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [
          UserEntity,
          BookEntity,
          CategoryEntity,
          OrderEntity,
          OrderDetailEntity,
          RoomEntity,
          MessageEntity,
        ],
        synchronize: true,
        useUTC: true,
      }),
    }),

    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('mailer.host'),
          secure: false,
          auth: {
            user: configService.get('mailer.user'),
            pass: configService.get('mailer.password'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get('mailer.from')}>`,
        },
        template: {
          dir: join(__dirname, 'src/templates/email'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
        ttl: 60 * 10,
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
        },
      }),
    }),
  ],
})
export class AppModule {}
