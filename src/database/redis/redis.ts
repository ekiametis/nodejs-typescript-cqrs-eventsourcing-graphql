import redis, { RedisClient, ClientOpts } from 'redis';
import { getLogger } from 'log4js';
import { ILogger } from '../../components/logger/logger';

export class RedisWrapper {

    client: RedisClient;
    logger: ILogger = getLogger('system');
    loggerError: ILogger = getLogger('systemError');

    private constructor(options: ClientOpts) {
        this.client = redis.createClient(options);
        this.registerListeners(this.client, options);
    }

    static build(options: ClientOpts): RedisWrapper {
        return new RedisWrapper(options);
    }

    private registerListeners(client: RedisClient, options: ClientOpts): void {
        const logger = this.logger;
        const loggerError = this.loggerError;
        client.on("error", function(err) {
            loggerError.error(err)
        });
        
        client.on("ready", function() {
            logger.info(`[REDIS] - Connection established on ${options.host}!`)
        });
        
        client.on("connect", function() {
            logger.info(`[REDIS] - Connected with the server on ${options.host}!`)
        });
        
        client.on("reconnecting", function() {
            logger.warn(`[REDIS] - Application is trying to reconnect with Redis on ${options.host}!`)
        });
        
        client.on("end", function() {
            logger.warn(`[REDIS] - Application is closing connection with Redis on ${options.host}!`)
        });
    }

    async get(key): Promise<any> {
        return new Promise((resolve, reject) => {
            this.logger.debug(`Retrieving key: ${key}`);
            this.client.get(key, (err, reply) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(reply)
                }
            });
        });
    }
    
    async set(key: string, value: any, expiresIn?: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.logger.debug(`Attaching to the key ${key} value ${value}`);
            if(expiresIn){
                this.client.set(key, value, 'EX', expiresIn, (err) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve()
                    }
                });
            } else {
                this.client.set(key, value, (err) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve()
                    }
                });
            }
        });
    }
}