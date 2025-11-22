import { Schema, Document } from 'mongoose';

export interface OrderDocument extends Document {
    productId: string;
    quantity: number;
    totalPrice: number;
    createdAt: Date;
}

export const OrderSchema = new Schema<OrderDocument>({
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});
