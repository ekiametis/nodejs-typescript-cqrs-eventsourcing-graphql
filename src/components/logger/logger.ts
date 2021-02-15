export interface ILogger {
    
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    fatal(message: string): void;
}

export class Logger implements ILogger {

    constructor(private logger: any){}

    debug(message: string): void {
        this.logger.debug(message);
    }
    info(message: string): void {
        this.logger.info(message);
    }
    warn(message: string): void {
        this.logger.warn(message);
    }
    error(message: string): void {
        this.logger.error(message);
    }
    fatal(message: string): void {
        this.logger.fatal(message);
    }

}

export interface ILoggerStore<Key> {
    addLogger(key: Key, logger: ILogger): ILoggerStore<Key>;
    getLogger(key: Key): ILogger;
}

export interface ILoggerConfigurator<Key> {
    setup(): ILoggerConfigurator<Key>;
    getLoggerStore(): ILoggerStore<Key>;
}