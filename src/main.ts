import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {

  // -------- REST APP (for Swagger + health endpoints) ----------
  const app = await NestFactory.create(AppModule);

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Order Service API')
    .setDescription('REST API for Order Service + Swagger documentation')
    .setVersion('1.0')
    .addTag('orders')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.REST_PORT || 3000);
  console.log(`REST Server running on http://localhost:${process.env.REST_PORT || 3000}`);
  console.log(`Swagger UI available at http://localhost:${process.env.REST_PORT || 3000}/swagger`);

  // -------- gRPC MICROSERVICE (MAIN SERVICE) ----------
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'order',
        protoPath: join(__dirname, './proto/order.proto'),
        url: process.env.ORDER_GRPC_URL || '0.0.0.0:50052',
      },
    },
  );

  await grpcApp.listen();
  console.log(`Order gRPC Service is running on ${process.env.ORDER_GRPC_URL || '0.0.0.0:50052'}`);
}

bootstrap();
