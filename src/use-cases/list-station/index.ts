import { ListStationQueryHandler } from "./list-station-query";
import { mongoStationRepository } from "../../repository";
import { ListStationDataSource } from "./list-station-datasource";
import { ListStationQueryDef, ListStationTypeDef } from "./list-station-typedef";
import { ListStationResolver } from "./list-station-resolver";

const listStationQueryHandler = ListStationQueryHandler.build(mongoStationRepository);
const listStationDataSource = ListStationDataSource.build(listStationQueryHandler);

export {
    ListStationQueryDef,
    ListStationTypeDef,
    ListStationResolver,
    listStationQueryHandler,
    listStationDataSource,
}