import { IQueryHandler } from "../../components/query/query";
import { ILogger } from "../../components/logger/logger";
import { getLoggerStore } from "../../config/logger-config";
import { IListStationResponseDTO, IListStationRequestDTO } from "./list-station-dto";
import { StationRepository } from "../../repository/station/mongo-station-repository";

export class ListStationQueryHandler implements IQueryHandler<IListStationRequestDTO, IListStationResponseDTO> {

    logger: ILogger = getLoggerStore('system');
    loggerError: ILogger = getLoggerStore('systemError');
    
    private constructor(
        private repository: StationRepository
    ) {
        this.execute = this.execute.bind(this);
    }

    static build(
        repository: StationRepository,
    ): ListStationQueryHandler {
        return new ListStationQueryHandler(repository);
    }
    
    async execute(data: IListStationRequestDTO): Promise<IListStationResponseDTO> {
        try {
            this.logger.info(`Aggregating stations by their planets`);
            const planetName = data ? data.planetName : null;
            const result = await this.repository.aggregateStationsByPlanets(planetName);
            this.logger.info(`Station aggregation loaded with success!`);
            return { result }
        } catch(err) {
            this.loggerError.error(err);
            throw err;
        }
    }
}