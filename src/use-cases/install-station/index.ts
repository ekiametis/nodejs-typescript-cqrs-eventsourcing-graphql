import { InstallStationCommandHandler } from "./install-station-command";
import { mongoStationRepository, redisEventRepository } from "../../repository";
import { redisPlanetRepository } from "../../repository/planet";
import { rabbitMqEventStore } from "../../event";
import { InstallStationDataSource } from "./install-station-datasource";
import { InstallStationTypeDef, InstallStationMutationDef } from "./install-station-typedef";
import { InstallStationResolver } from "./install-station-resolver";


const installStationCommandHandler = InstallStationCommandHandler.build(mongoStationRepository, redisPlanetRepository, redisEventRepository, rabbitMqEventStore);
const installStationDataSource = InstallStationDataSource.build(installStationCommandHandler);

export {
    InstallStationTypeDef,
    InstallStationMutationDef,
    InstallStationResolver,
    installStationDataSource,
    installStationCommandHandler,
}