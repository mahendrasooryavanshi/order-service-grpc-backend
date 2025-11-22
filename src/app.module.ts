import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { DatabaseConfigModule } from './config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseConfigModule, // <– clean DB config
    OrdersModule,
  ],
})
export class AppModule { }
