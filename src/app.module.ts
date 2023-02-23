import { Module } from '@nestjs/common';
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
        ],
        synchronize: true,
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
  ],
})
export class AppModule {}
