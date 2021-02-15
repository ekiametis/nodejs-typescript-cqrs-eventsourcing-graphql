import { IQueryHandler } from "../../components/query/query";
import { IListSuitablePlanetResponseDTO, SuitablePlanetDTO } from "./list-suitable-planet-dto";
import { ILogger } from "../../components/logger/logger";
import { getLoggerStore } from "../../config/logger-config";
import { ISchemaRepository } from "../../repository/schema-repository/schema-repository";
import { Station } from "../../domains/station";
import { IStationModel } from "../../repository/station/mongo-station-repository";
import { RetrieveSuitablePlanetsIntegration } from "../../integration/nasa/retrieve-suitable-planets-integration";
import { Planet } from "../../domains/planet";

export class ListSuitablePlanetQueryHandler implements IQueryHandler<any, IListSuitablePlanetResponseDTO> {

    logger: ILogger = getLoggerStore('system');
    loggerError: ILogger = getLoggerStore('systemError');
    
    private constructor(
        private repository: ISchemaRepository<Station, IStationModel>,
        private integration: RetrieveSuitablePlanetsIntegration,
    ) {
        this.execute = this.execute.bind(this);
    }

    static build(
        repository: ISchemaRepository<Station, IStationModel>,
        integration: RetrieveSuitablePlanetsIntegration,
    ): ListSuitablePlanetQueryHandler {
        return new ListSuitablePlanetQueryHandler(repository, integration);
    }
    
    async execute(): Promise<IListSuitablePlanetResponseDTO> {
        try {
            const exoplanets = await this.integration.getExoplanets();
            const stations = await this.repository.find({});
            this.logger.info(`The number of stations found is ${stations.length} and the number of exoplanets found is ${exoplanets.length}`);
            const result = this.formatResult(exoplanets, stations);
            return { suitablePlanets: result }
        } catch(err) {
            this.loggerError.error(err);
            throw err;
        }
    }

    private formatResult(exoplanets: Array<Planet>, stations: Array<IStationModel>): Array<SuitablePlanetDTO> {
        return exoplanets.map( exoplanet => {
            const station = stations.find(station => station.planet.name === exoplanet.name);
            return {
                name: exoplanet.name,
                mass: exoplanet.mass,
                hasStation: !!station,
            }
        });
    }
    
}