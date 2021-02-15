import { IKeyValueRepository } from "../key-value-repository/key-value-repository";
import { Planet } from "../../domains/planet";
import { RedisWrapper } from "../../database/redis/redis";
import { ILogger } from "../../components/logger/logger";
import { getLoggerStore } from "../../config/logger-config";

export class RedisPlanetRepository implements IKeyValueRepository<String, Planet> {

    static KEY_NAME = 'PLANET_'

    logger: ILogger = getLoggerStore('system');
    loggerError: ILogger = getLoggerStore('systemError');

    private constructor(private database: RedisWrapper) {}

    static build(database: RedisWrapper): RedisPlanetRepository {
        return new RedisPlanetRepository(database);
    }

    async set(name: string, value: Planet, expiresIn?: number): Promise<void> {
        try {
            this.logger.debug(`Attaching planet with name ${name} and value ${JSON.stringify(value)}`);
            await this.database.set(`${RedisPlanetRepository.KEY_NAME}${name}`, JSON.stringify(value), expiresIn);
        } catch(err) {
            this.loggerError.error(err);
            throw err;
        }
    }

    async get(name: String): Promise<Planet> {
        try {
            this.logger.debug(`Retrieving planet with name ${name}`);
            const result = await this.database.get(`${RedisPlanetRepository.KEY_NAME}${name}`);
            if(result) {
                return JSON.parse(result);
            }
            return result;
        } catch(err) {
            this.loggerError.error(err);
            throw err;
        }
    }

}