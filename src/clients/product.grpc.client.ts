import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { BaseGrpcClient } from './base.grpc.client';

type ProductServiceGrpc = {
    GetProduct(data: { id: string }): any;
    ReduceStock(data: { id: string; quantity: number }): any;
};

@Injectable()
export class ProductGrpcClient
    extends BaseGrpcClient<ProductServiceGrpc>
    implements OnModuleInit {
    constructor(
        @Inject('PRODUCT_PACKAGE')
        protected readonly client: ClientGrpc,
    ) {
        super(client, 'ProductService');
    }

    onModuleInit() {
        this.init(); // initializes this.svc
    }

    getProduct(id: string) {
        return this.call('GetProduct', { id });
    }

    reduceStock(id: string, quantity: number) {
        return this.call('ReduceStock', { id, quantity });
    }
}
