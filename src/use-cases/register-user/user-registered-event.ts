import { IEvent, IEventHandler, EventId } from "../../components/event/event";
import { IUserRegisteredDTO } from "./register-user-dto";
import { getLoggerStore } from "../../config/logger-config";
import { ISchemaRepository } from "../../repository/schema-repository/schema-repository";
import { User } from "../../domains/user";
import { ILogger } from "../../components/logger/logger";
import { IUserModel } from "../../repository/user/mongo-user-repository";

export class UserRegisteredEvent implements IEvent<IUserRegisteredDTO> {

    static NAME = "UserRegisteredEvent";

    id: EventId;
    date: Date;
    data: IUserRegisteredDTO;

    private constructor(data: IUserRegisteredDTO) {
        this.id = { uniqueId: data.email, eventName: UserRegisteredEvent.NAME }
        this.date = new Date();
        this.data = data;
    }

    static build(data: IUserRegisteredDTO): UserRegisteredEvent {
        return new UserRegisteredEvent(data);
    }

}

export class UserRegisteredEventHandler implements IEventHandler<UserRegisteredEvent> {

    static NAME = "UserRegisteredEventHandler";
    eventName: string;
    logger: ILogger = getLoggerStore('system');
    loggerError: ILogger = getLoggerStore('systemError');

    private constructor(private repository: ISchemaRepository<User, IUserModel>){
        this.eventName = UserRegisteredEvent.NAME;
        this.handle = this.handle.bind(this);
    }

    static build(repository: ISchemaRepository<User, IUserModel>): UserRegisteredEventHandler {
        return new UserRegisteredEventHandler(repository);
    }

    async handle(event: UserRegisteredEvent): Promise<void> {
        try {
            this.logger.info(`Handle event with id ${event.id.eventName}-${event.id.uniqueId}`);
            const userAlreadyRegistered = await this.repository.findOne({ email: event.data.email });
            if(!userAlreadyRegistered) {
                await this.repository.create(event.data);
                this.logger.info(`User ${event.data.email} registered with sucess!`)
            } else {
                this.logger.info(`User ${event.data.email} is already registered!`)
            }
        } catch(err) {
            this.loggerError.error(err);
            throw err;
        }
    }
}