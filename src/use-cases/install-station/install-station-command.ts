import { ICommand, ICommandHandler } from "../../components/command/command";
import { IInstallStationRequestDTO, IStationInstalledDTO } from "./install-station-dto";
import { v4 as uuid } from 'uuid';
import { ISchemaRepository } from "../../repository/schema-repository/schema-repository";
import { Station } from "../../domains/station";
import { IStationModel } from "../../repository/station/mongo-station-repository";
import { IKeyValueRepository } from "../../repository/key-value-repository/key-value-repository";
import { EventId, IEvent, IEventStore } from "../../components/event/event";
import { IDTO } from "../../components/dto/dto";
import { getLoggerStore } from "../../config/logger-config";
import { ILogger } from "../../components/logger/logger";
import { StationInstalledEvent } from "./install-station-event";
import { IDomain } from "../../components/domain/domain";
import { Planet } from "../../domains/planet";
import { StationAlreadyExist } from "../../exceptions/station/station-already-exist";
import { PlanetNotExist } from "../../exceptions/planets/planet-not-exist";

export class InstallStationCommand implements ICommand<IInstallStationRequestDTO> {

    static NAME = "InstallStationCommand";

    commandName: string = InstallStationCommand.NAME;
    id: string;
    data: IInstallStationRequestDTO;

    private constructor(data: IInstallStationRequestDTO) {
        this.id = uuid();
        this.data = data;
    }

    static build(data: IInstallStationRequestDTO) {
        return new InstallStationCommand(data);
    }
}

export class InstallStationCommandHandler implements ICommandHandler<InstallStationCommand> {

    static NAME = 'InstallStationCommandHandler';

    logger: ILogger = getLoggerStore('system');
    loggerError: ILogger = getLoggerStore('systemError');

    private constructor(
        private repository: ISchemaRepository<Station, IStationModel>,
        private planetRepository: IKeyValueRepository<String, IDomain>,
        private eventRepository: IKeyValueRepository<EventId, IEvent<IDomain>>,
        private eventStore: IEventStore,
    ) {
        this.execute = this.execute.bind(this);
    }

    static build(
        repository: ISchemaRepository<Station, IStationModel>,
        planetRepository: IKeyValueRepository<String, Planet>,
        eventRepository: IKeyValueRepository<EventId, IEvent<IDTO>>,
        eventStore: IEventStore,
    ): InstallStationCommandHandler {
        return new InstallStationCommandHandler(repository, planetRepository, eventRepository, eventStore);
    }

    async execute(command: InstallStationCommand): Promise<any> {
        try {
            this.logger.info(`Command is being executed: ${InstallStationCommandHandler.NAME}`);
            this.logger.debug(`Command value: ${JSON.stringify(command)}`);
            const stationFound = await this.repository.findOne({ name: command.data.stationName });
            const eventId = { uniqueId: command.data.stationName, eventName: StationInstalledEvent.NAME }
            let event = await this.eventRepository.get(eventId);
            if(stationFound && eventId) {
                throw new StationAlreadyExist('Station already installed.');
            } else if(!stationFound) {
                const planet = <Planet> await this.planetRepository.get(command.data.planetName);
                if(!planet) {
                    throw new PlanetNotExist(`There is no planet with the name ${command.data.planetName}.`);
                }
                const value: IStationInstalledDTO = {
                    name: command.data.stationName,
                    planet: {
                        name: command.data.planetName,
                        mass: planet.mass,
                    }
                } 
                event = StationInstalledEvent.build(value);
            } else {
                event = StationInstalledEvent.build(stationFound);
            }
            await this.eventStore.save(event);
            return command.data;
        } catch(err) {
            this.loggerError.error(err);
            throw err;
        }
    }

}