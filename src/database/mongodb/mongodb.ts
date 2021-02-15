import mongoose, { ConnectionOptions, Mongoose, Connection } from 'mongoose';
import { getLoggerStore } from '../../config/logger-config';
import { ILogger } from '../../components/logger/logger';

export class MongoWrapper {

    db: Mongoose;
    logger: ILogger = getLoggerStore('system');
    loggerError: ILogger = getLoggerStore('systemError');

    private constructor(private mongodbURLConnection: string, private options?: ConnectionOptions) {
        this.connect = this.connect.bind(this);
        this.getConnection = this.getConnection.bind(this);
    }

    static build(mongodbURLConnection: string, options?: ConnectionOptions): MongoWrapper {
        return new MongoWrapper(mongodbURLConnection, options);
    }

    async connect() {
        this.logger.info(`Trying to connect on ${this.mongodbURLConnection}`)
        this.db = await mongoose.connect(this.mongodbURLConnection, this.options);
        this.registerListeners(this.mongodbURLConnection, this.db);
    }

    getConnection(): Mongoose {
        return this.db;
    }

    private registerListeners(url: string, db: Mongoose): void {
        const connection: Connection = db.connection;
        const logger = this.logger;
        const loggerError = this.loggerError;
        connection.on('connected', function () {
            logger.warn(`[MONGO] - Mongoose connected on ${url}`);
        });
        connection.on('disconnected', function () {
            logger.warn('[MONGO] - Mongoose has been disconnected.');
        });
        connection.on('error', function (err) {
            loggerError.error(`[MONGO] - An error ocurred on mongoose connection: ${err}`);
        });
        connection.on('connecting', function () {
            logger.warn('[MONGO] - Mongoose is connecting.');
        });
        connection.on('disconnecting', function () {
            logger.warn('[MONGO] - Mongoose is disconnecting.');
        });
        connection.on('close', function () {
            logger.warn('[MONGO] - Mongoose connection has been closed.');
        });
        connection.on('reconnected', function () {
            logger.warn('[MONGO] - Mongoose has been reconnected with success');
        });
        connection.on('reconnectFailed', function (err) {
            logger.warn('[MONGO] - Mongoose reconnetion failed.');
        });
    }
    
}