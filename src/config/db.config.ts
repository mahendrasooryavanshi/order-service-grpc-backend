import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: process.env.MONGO_PRIMARY_URL ?? 'mongodb://127.0.0.1:27017/orderdb',

                dbName: process.env.DB_NAME ?? 'orderdb',

                // Local standalone MongoDB MUST use primary
                readPreference: 'primary',

                maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 20,
                minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE) || 5,

                retryWrites: false,   // IMPORTANT for non-replica local mongo
                w: 'majority',

                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 5000,

                ssl: false,
            }),
        }),
    ],
})
export class DatabaseConfigModule { }
