import { IKeyValueRepository } from "../key-value-repository/key-value-repository";
import { IEvent, EventId } from "../../components/event/event";
import { IDTO } from "../../components/dto/dto";
import { RedisWrapper } from "../../database/redis/redis";
import { getLoggerStore } from "../../config/logger-config";
import { ILogger } from "../../components/logger/logger";

export class RedisEventRepository implements IKeyValueRepository<EventId, IEvent<IDTO>> {

    logger: ILogger = getLoggerStore('system');
    loggerError: ILogger = getLoggerStore('systemError');

    private constructor(private database: RedisWrapper) {}

    static build(database: RedisWrapper): RedisEventRepository {
        return new RedisEventRepository(database);
    }
    
    async set(id: EventId, value: IEvent<IDTO>): Promise<void> {
        try {
            const key = `${id.eventName}-${id.uniqueId}`;
            this.logger.debug(`Attaching event with identifier ${key} and value ${value}`);
            await this.database.set(key, JSON.stringify(value));
        } catch(err) {
            this.loggerError.error(err);
            throw err;
        }
    }
    async get(id: EventId): Promise<IEvent<IDTO>> {
        try {
            const key = `${id.eventName}-${id.uniqueId}`;
            this.logger.debug(`Retrieving event with identifier ${key}`);
            const result = await this.database.get(key);
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