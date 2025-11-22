import { Injectable, Logger } from '@nestjs/common';
import { OrderRepository } from './repository/order.repository';
import { ProductGrpcClient } from '../clients/product.grpc.client';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly repo: OrderRepository,
    private readonly productClient: ProductGrpcClient,
  ) { }

  // ---- CREATE ORDER ----
  async createOrder(dto: CreateOrderDto) {
    this.logger.debug(`Creating order: ${JSON.stringify(dto)}`);

    const EMPTY_ORDER = {
      id: '',
      productId: '',
      quantity: 0,
      totalPrice: 0,
      createdAt: '',
    };

    // 1. Fetch product
    const product = await this.productClient.getProduct(dto.productId);

    if (!product?.data) {
      return {
        success: false,
        message: 'Product not found',
        data: EMPTY_ORDER,
      };
    }

    // 2. Check stock
    if (product.data.stock < dto.quantity) {
      return {
        success: false,
        message: 'Insufficient stock',
        data: EMPTY_ORDER,  // ✅ NOT NULL
      };
    }

    // 3. Reduce stock in Product Service
    await this.productClient.reduceStock(dto.productId, dto.quantity);

    // 4. Save order in DB
    const order = await this.repo.create({
      productId: dto.productId,
      quantity: dto.quantity,
      totalPrice: product.data.price * dto.quantity,
    });
    console.log(order)
    return {
      success: true,
      message: 'Order created successfully',
      data: {
        id: order._id.toString(),
        productId: order.productId,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt.toISOString(),
      },
    };
  }

  // ---- GET ALL ORDERS ----
  async listOrders() {
    const orders = await this.repo.findAll();

    return {
      success: true,
      message: 'Orders list fetched successfully',
      data: orders.map((order) => ({
        id: order._id.toString(),
        productId: order.productId,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt.toISOString(),
      })),
    };
  }

  // ---- GET ONE ORDER ----
  async getOrder(id: string) {
    const order = await this.repo.findById(id);

    if (!order) {
      return { success: false, message: 'Order not found', data: null };
    }

    return {
      success: true,
      message: 'Order fetched successfully',
      data: {
        id: order._id.toString(),
        productId: order.productId,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt.toISOString(),
      },
    };
  }

  // ---- UPDATE ORDER (optional, only if proto includes it) ----
  async updateOrder(id: string, dto: any) {
    const order = await this.repo.update(id, dto);

    if (!order) {
      return { success: false, message: 'Order not found', data: null };
    }

    return {
      success: true,
      message: 'Order updated successfully',
      data: {
        id: order._id.toString(),
        productId: order.productId,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt.toISOString(),
      },
    };
  }

  // ---- DELETE ORDER (optional) ----
  async deleteOrder(id: string) {
    const deleted = await this.repo.delete(id);

    if (!deleted) {
      return { success: false, message: 'Order not found', data: null };
    }

    return {
      success: true,
      message: 'Order deleted successfully',
      data: null,
    };
  }
}
