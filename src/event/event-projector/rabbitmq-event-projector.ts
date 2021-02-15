import { UserRegisteredEventHandler } from "../../use-cases/register-user/user-registered-event";
import { mongoUserRepository, mongoStationRepository } from "../../repository";
import { IEventProjector, IEventBus } from "../../components/event/event";
import { StationInstalledEventHandler } from "../../use-cases/install-station/install-station-event";

export class RabbitMQEventProjector implements IEventProjector {

    private constructor(private eventBus: IEventBus){}

    static build(eventBus: IEventBus): RabbitMQEventProjector {
        return new RabbitMQEventProjector(eventBus);
    }

    listen(): Promise<void> {
        this.eventBus.addEventHandler(UserRegisteredEventHandler.build(mongoUserRepository));
        this.eventBus.addEventHandler(StationInstalledEventHandler.build(mongoStationRepository));
        return this.eventBus.listen();
    }
}
