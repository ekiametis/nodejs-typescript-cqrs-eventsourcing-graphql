import { setup } from './config';
import { getLoggerStore } from './config/logger-config';

const init = async () => {
    await setup();
    const logger = getLoggerStore('system');
    const loggerError = getLoggerStore('systemError');
    const { server } = require("./app");
    server.listen().then(({url}) => {
        logger.info(`Server up on ${url}`)
    }).catch(err => {
        loggerError.error(err);
    });
}

init();