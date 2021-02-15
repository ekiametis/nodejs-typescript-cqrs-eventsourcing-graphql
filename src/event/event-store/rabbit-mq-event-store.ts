import { IEventStore, IEvent, IEventBus, EventId } from "../../components/event/event";
import { IDTO } from "../../components/dto/dto";
import { getLoggerStore } from "../../config/logger-config";
import { ILogger } from "../../components/logger/logger";
import { IKeyValueRepository } from "../../repository/key-value-repository/key-value-repository";

export class RabbitMQEventStore implements IEventStore {

    logger: ILogger = getLoggerStore('system');
    loggerError: ILogger = getLoggerStore('systemError');

    private constructor(private repository: IKeyValueRepository<EventId, IEvent<IDTO>>, private eventBus: IEventBus) {}
    
    static build(repository: IKeyValueRepository<EventId, IEvent<IDTO>>, eventBus: IEventBus): RabbitMQEventStore {
        return new RabbitMQEventStore(repository, eventBus);
    }

    async save(event: IEvent<IDTO>): Promise<void> {
        try {
            this.logger.info(`Storing event ${event.id.eventName}-${event.id.uniqueId}`);
            await this.repository.set(event.id, event);
            await this.eventBus.publish(event.id, event);
            this.logger.info(`Event ${event.id.eventName}-${event.id.uniqueId} stored with success`);
        } catch(err) {
            this.loggerError.error(err);
            throw err;
        }
    }

}