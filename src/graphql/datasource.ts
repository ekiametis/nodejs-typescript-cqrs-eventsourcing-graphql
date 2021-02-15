import { registerUserDataSource } from "../use-cases/register-user"
import { authenticationDataSource } from "../use-cases/authentication";
import { listSuitablePlanetDataSource } from "../use-cases/list-suitable-planet";
import { installStationDataSource } from "../use-cases/install-station";
import { listStationDataSource } from '../use-cases/list-station';

export default () => {
    return {
        authenticationDataSource,
        registerUserDataSource,
        listSuitablePlanetDataSource,
        installStationDataSource,
        listStationDataSource,
    }
}