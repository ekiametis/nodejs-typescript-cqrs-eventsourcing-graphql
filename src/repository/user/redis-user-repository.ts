import { User } from "../../domains/user";
import { IKeyValueRepository } from "../key-value-repository/key-value-repository";
import { RedisWrapper } from "../../database/redis/redis";
import { getLoggerStore } from "../../config/logger-config";
import { ILogger } from "../../components/logger/logger";

export class RedisUserRepository implements IKeyValueRepository<String, User> {

    logger: ILogger = getLoggerStore('system');
    loggerError: ILogger = getLoggerStore('systemError');
    
    private constructor(private database: RedisWrapper) {}

    static build(database: RedisWrapper): RedisUserRepository {
        return new RedisUserRepository(database);
    }
    
    async set(email: string, value: User): Promise<void> {
        try {
            this.logger.debug(`Attaching user with email ${email} and value ${JSON.stringify(value)}`);
            await this.database.set(email, JSON.stringify(value));
        } catch(err) {
            this.loggerError.error(err);
            throw err;
        }
    }
    async get(email: string): Promise<User> {
        try {
            this.logger.debug(`Retrieving user with email ${email}`);
            const result = await this.database.get(email);
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