export const setup = async () => {
    const LoggerConfig = require('./logger-config');
    await LoggerConfig.setup();
    const DatabaseConfig = require('./database-config');
    await DatabaseConfig.setup();
}

export default {
    setup,
}