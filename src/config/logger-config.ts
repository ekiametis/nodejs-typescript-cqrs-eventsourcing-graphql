import { Log4JSLoggerConfigurator } from "../utils/logger/log4js-logger";
import { LoggerStore } from "../utils/logger/logger";
import { ILoggerStore, ILogger } from "../components/logger/logger";

let loggerStore: ILoggerStore<string>;

export const setup = () => {
    loggerStore = Log4JSLoggerConfigurator
        .build()
        .setup()
        .getLoggerStore();
}

export const getLoggerStore = (categoryName: string): ILogger => {
    return loggerStore.getLogger(categoryName);
}

export default {
    setup,
}