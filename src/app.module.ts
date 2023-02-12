import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { EnvironmentModule } from './environment/environment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    EnvironmentModule,
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB,
    }),
    MailerModule.forRoot({
      transport: `smtp://${process.env.MAIL_SMTP_EMAIL}:${process.env.MAIL_SMTP_PASSWORD}@${process.env.MAIL_SMTP_HOST}`,
      defaults: {
        from: `<${process.env.MAIL_SMTP_DEFAULT_FROM}>`,
      },
    }),
    BookmarkModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
