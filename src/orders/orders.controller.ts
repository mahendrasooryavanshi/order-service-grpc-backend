import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  // ---- CREATE ORDER ----
  @GrpcMethod('OrderService', 'CreateOrder')
  createOrder(data: CreateOrderDto) {
    return this.ordersService.createOrder(data);
  }

  // ---- LIST ORDERS ----
  @GrpcMethod('OrderService', 'ListOrders')
  listOrders() {
    return this.ordersService.listOrders();
  }

  // ---- GET ONE ORDER ----
  @GrpcMethod('OrderService', 'GetOrder')
  getOrder(data: { id: string }) {
    return this.ordersService.getOrder(data.id);
  }

  // ---- UPDATE ORDER (optional) ----
  @GrpcMethod('OrderService', 'UpdateOrder')
  updateOrder(data: any) {
    return this.ordersService.updateOrder(data.id, data);
  }

  // ---- DELETE ORDER (optional) ----
  @GrpcMethod('OrderService', 'DeleteOrder')
  deleteOrder(data: { id: string }) {
    return this.ordersService.deleteOrder(data.id);
  }
}
