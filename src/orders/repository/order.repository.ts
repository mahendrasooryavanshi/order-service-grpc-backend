import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDocument } from '../schema/order.schema';

@Injectable()
export class OrderRepository {
    constructor(
        @InjectModel('Order') private readonly orderModel: Model<OrderDocument>,
    ) { }

    async create(data: Partial<OrderDocument>) {
        return new this.orderModel(data).save();
    }

    async findAll() {
        return this.orderModel.find().sort({ createdAt: -1 });
    }

    async findById(id: string) {
        return this.orderModel.findById(id);
    }

    async update(id: string, data: Partial<OrderDocument>) {
        return this.orderModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string) {
        return this.orderModel.findByIdAndDelete(id);
    }
}
