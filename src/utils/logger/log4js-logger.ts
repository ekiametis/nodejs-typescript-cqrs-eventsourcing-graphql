import { Logger } from "../../components/logger/logger";
import log4js, { Configuration, Appender, Levels } from 'log4js';
import { LoggerStore, LoggerConfigurator } from "./logger";

interface LocalCategory {
    [name: string]: {
        appenders: string[];
        level: string;
        enableCallStack?: boolean;
    }
}

interface LocalAppender {
    [name: string]: Appender
}

class Log4JSBuilderConfigurator {

    private options: Configuration;
    private appenders: LocalAppender;
    private categories: LocalCategory;
    private levels: Levels;
    private loggerStore: LoggerStore;

    private constructor(loggerStore: LoggerStore, options?: Configuration){
        this.loggerStore = loggerStore;
        this.options = options;
    }

    static start(loggerStore: LoggerStore, options?: Configuration): Log4JSBuilderConfigurator {
        return new Log4JSBuilderConfigurator(loggerStore, options);
    }

    addConfiguration(options: Configuration): Log4JSBuilderConfigurator {
        this.options = options;
        return this;
    }

    addAppenders(appenders: LocalAppender): Log4JSBuilderConfigurator {
        this.appenders = appenders;
        return this;
    }

    addCategories(categories: LocalCategory): Log4JSBuilderConfigurator {
        this.categories = categories;
        return this;
    }
    
    addLevels(levels: Levels): Log4JSBuilderConfigurator {
        this.levels = levels;
        return this;
    }

    configure(): Log4JSBuilderConfigurator {
        this.options = {
            appenders: this.appenders,
            categories: this.categories,
            levels: this.levels,
        }
        log4js.configure(this.options);
        return this;
    }

    addLogger(categoryName: string): Log4JSBuilderConfigurator {
        const logger = log4js.getLogger(categoryName);
        this.loggerStore.addLogger(categoryName, new Logger(logger));
        return this;
    }

    finish(): LoggerStore {
        return this.loggerStore;
    }
}

export class Log4JSLoggerStore extends LoggerStore {

    static instance: LoggerStore;

    private constructor(
        loggers: Map<string, Logger> = new Map<string, Logger>(),
    ) {
        super(loggers);
    }

    static build(): LoggerStore{
        if(!this.instance) {
            this.instance = new Log4JSLoggerStore();
        }
        return this.instance;
    }
}

export class Log4JSLoggerConfigurator extends LoggerConfigurator {

    static instance: Log4JSLoggerConfigurator;

    private constructor(
        loggerStore: Log4JSLoggerStore = Log4JSLoggerStore.build(),
    ) {
        super(loggerStore);
    }
    
    static build(): Log4JSLoggerConfigurator{
        if(!this.instance) {
            this.instance = new Log4JSLoggerConfigurator();
        }
        return this.instance;
    }
 
    setup(): LoggerConfigurator {
        const loggerStore = this.getLoggerStore();
        const newLoggerStore = Log4JSBuilderConfigurator
            .start(loggerStore)
            .addAppenders({
                default: { type: 'console' },
                console: { type: 'console' },
            })
            .addCategories({
                default: {
                    appenders: ['default'],
                    level: 'debug',
                    enableCallStack: true
                },
                system: {
                    appenders: ['console'],
                    level: 'info',
                    enableCallStack: true
                },
                systemError: {
                    appenders: ['console'],
                    level: 'error',
                    enableCallStack: true
                }
            })
            .configure()
            .addLogger('default')
            .addLogger('system')
            .addLogger('systemError')
            .finish();
        this.loggerStore = newLoggerStore;
        return this;
    }

}