import { RegisterUserResolver } from "../use-cases/register-user";
import { AuthenticationResolver } from "../use-cases/authentication";
import { ListSuitablePlanetResolver } from "../use-cases/list-suitable-planet";
import { InstallStationResolver } from "../use-cases/install-station";
import { ListStationResolver } from '../use-cases/list-station';

export default {
    Query: {
        ...AuthenticationResolver.Query,
        ...ListSuitablePlanetResolver.Query,
        ...ListStationResolver.Query,
    },
    Mutation: {
        ...RegisterUserResolver.Mutation,
        ...InstallStationResolver.Mutation
    }
}