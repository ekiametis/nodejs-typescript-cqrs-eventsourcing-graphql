import { ListSuitablePlanetQueryHandler } from "./list-suitable-planet-query";
import { mongoStationRepository } from "../../repository";
import { ListSuitablePlanetDataSource } from "./list-suitable-planet-datasource";
import { ListSuitablePlanetTypeDef, ListSuitablePlanetQueryDef } from "./list-suitable-planet-typedef";
import { ListSuitablePlanetResolver } from "./list-suitable-planet-resolver";
import { retrieveSuitablePlanetsDataSource } from "../../integration/nasa";

const listSuitablePlanetQueryHandler = ListSuitablePlanetQueryHandler.build(mongoStationRepository, retrieveSuitablePlanetsDataSource);
const listSuitablePlanetDataSource = ListSuitablePlanetDataSource.build(listSuitablePlanetQueryHandler);

export {
    ListSuitablePlanetTypeDef,
    ListSuitablePlanetQueryDef,
    ListSuitablePlanetResolver,
    listSuitablePlanetQueryHandler,
    listSuitablePlanetDataSource,
}