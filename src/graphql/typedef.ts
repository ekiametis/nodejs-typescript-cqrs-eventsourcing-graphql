import { RegisterUserTypeDef, RegisterUserMutationDef } from "../use-cases/register-user";
import { AuthenticationTypeDef, AuthenticationQueryDef } from "../use-cases/authentication";
import { ListSuitablePlanetTypeDef, ListSuitablePlanetQueryDef } from "../use-cases/list-suitable-planet";
import { InstallStationMutationDef, InstallStationTypeDef } from "../use-cases/install-station";
import { ListStationQueryDef, ListStationTypeDef } from '../use-cases/list-station';

export default `
    ${AuthenticationTypeDef}
    ${RegisterUserTypeDef}
    ${ListSuitablePlanetTypeDef}
    ${InstallStationTypeDef}
    ${ListStationTypeDef}

    type Mutation {
        ${RegisterUserMutationDef}
        ${InstallStationMutationDef}
    }

    type Query {
        ${AuthenticationQueryDef}
        ${ListSuitablePlanetQueryDef}
        ${ListStationQueryDef}
    }
`