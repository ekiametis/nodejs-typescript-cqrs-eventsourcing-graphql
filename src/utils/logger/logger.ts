import { ILoggerConfigurator, ILoggerStore, ILogger } from "../../components/logger/logger";

export abstract class LoggerStore implements ILoggerStore<string> {

    loggers: Map<string, ILogger>;

    public constructor(
        loggers: Map<string, ILogger>,
    ) {
        this.loggers = loggers;
    }

    addLogger(key: string, logger: ILogger): ILoggerStore<string> {
        this.loggers.set(key, logger);
        return this;
    }

    getLogger(key: string): ILogger {
        return this.loggers.get(key);
    }

}

export abstract class LoggerConfigurator implements ILoggerConfigurator<string> {

    loggerStore: LoggerStore;

    public constructor(
        loggerStore: LoggerStore,
    ) {
        this.loggerStore = loggerStore;
    }

    abstract setup(): LoggerConfigurator;

    getLoggerStore(): LoggerStore {
        return this.loggerStore;
    }
}