import { IEvent, EventId, IEventHandler } from "../../components/event/event";
import { IStationInstalledDTO } from "./install-station-dto";
import { IStationModel } from "../../repository/station/mongo-station-repository";
import { Station } from "../../domains/station";
import { ISchemaRepository } from "../../repository/schema-repository/schema-repository";
import { ILogger } from "../../components/logger/logger";
import { getLoggerStore } from "../../config/logger-config";

export class StationInstalledEvent implements IEvent<IStationInstalledDTO> {

    static NAME = "StationInstalledEvent";

    id: EventId;
    date: Date;
    data: IStationInstalledDTO;

    private constructor(data: IStationInstalledDTO) {
        this.id = { uniqueId: data.name, eventName: StationInstalledEvent.NAME }
        this.date = new Date();
        this.data = data;
    }

    static build(data: IStationInstalledDTO): StationInstalledEvent {
        return new StationInstalledEvent(data);
    }
}

export class StationInstalledEventHandler implements IEventHandler<StationInstalledEvent> {

    static NAME = "StationInstalledEventHandler";
    eventName: string;
    logger: ILogger = getLoggerStore('system');
    loggerError: ILogger = getLoggerStore('systemError');

    private constructor(private repository: ISchemaRepository<Station, IStationModel>){
        this.eventName = StationInstalledEvent.NAME;
        this.handle = this.handle.bind(this);
    }

    static build(repository: ISchemaRepository<Station, IStationModel>): StationInstalledEventHandler {
        return new StationInstalledEventHandler(repository);
    }

    async handle(event: StationInstalledEvent): Promise<void> {
        try {
            this.logger.info(`Handle event with id ${event.id.eventName}-${event.id.uniqueId}`);
            const stationAlreadyInstalled = await this.repository.findOne({ name: event.data.name });
            if(!stationAlreadyInstalled) {
                await this.repository.create(event.data);
                this.logger.info(`Station ${event.data.name} installed with sucess!`)
            } else {
                this.logger.info(`Station ${event.data.name} is already installed!`)
            }
        } catch(err) {
            this.loggerError.error(err);
            throw err;
        }
    }
}