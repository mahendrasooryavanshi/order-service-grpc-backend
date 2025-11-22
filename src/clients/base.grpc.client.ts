import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, timeout, retry } from 'rxjs';
import CircuitBreaker from 'opossum';

export class BaseGrpcClient<T extends object> {
    protected svc: T;
    protected circuit: CircuitBreaker;
    protected client: ClientGrpc;

    constructor(client: ClientGrpc, private serviceName: string) {
        this.client = client;

        this.circuit = new CircuitBreaker(async (fn: Function, ...args: any[]) => {
            return await fn(...args);
        }, {
            timeout: 5000,
            errorThresholdPercentage: 50,
            resetTimeout: 10000,
        });
    }

    init() {
        this.svc = this.client.getService<T>(this.serviceName);
    }

    async call<K extends keyof T>(method: K, payload: any): Promise<any> {
        const fn = () =>
            lastValueFrom(
                (this.svc[method] as any)(payload).pipe(
                    timeout(5000),
                    retry({ count: 2 })
                )
            );

        return this.circuit.fire(fn);
    }
}
