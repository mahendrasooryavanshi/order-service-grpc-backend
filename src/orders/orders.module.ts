import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { OrdersController } from './orders.controller';
import { OrderRepository } from './repository/order.repository';
import { OrderSchema } from './schema/order.schema';

// gRPC client
import { ProductGrpcClient } from '../clients/product.grpc.client';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    // Database
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
    ]),

    // gRPC Clients
    ClientsModule.register([
      {
        name: 'PRODUCT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: join(__dirname, '../proto/product.proto'),
          url: process.env.PRODUCT_GRPC_URL || 'localhost:50051',
        },
      },
    ]),
  ],

  controllers: [OrdersController],

  providers: [
    OrdersService,
    OrderRepository,
    ProductGrpcClient,
  ],
})
export class OrdersModule { }
