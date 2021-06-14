import { MiddlewareConsumer, Module, CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ValidateMiddleware } from './app.middleware';

@Module({
  imports: [ConfigModule.forRoot(), CacheModule.register()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateMiddleware).forRoutes('');
  }
}
