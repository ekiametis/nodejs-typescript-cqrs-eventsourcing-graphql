import { RESTDataSource } from "apollo-datasource-rest";
import { IListSuitablePlanetResponseDTO } from "./list-suitable-planet-dto";
import { ListSuitablePlanetQueryHandler } from "./list-suitable-planet-query";
import { getLoggerStore } from "../../config/logger-config";
import { ILogger } from "../../components/logger/logger";
import { HttpException } from "../../exceptions/http/http-exception";
import { HttpStatusCode } from "../../enums/http-status-code";
import { UserNotAuthorized } from "../../exceptions/users/user-not-authorized";
import { ITokenDTO } from "../authentication/authentication-dto";

export class ListSuitablePlanetDataSource extends RESTDataSource {

    loggerError: ILogger = getLoggerStore('systemError');

    private constructor(private handler: ListSuitablePlanetQueryHandler){
        super();
    }

    static build(handler: ListSuitablePlanetQueryHandler): ListSuitablePlanetDataSource {
        return new ListSuitablePlanetDataSource(handler);
    }

    async listSuitablePlanets(user: ITokenDTO): Promise<IListSuitablePlanetResponseDTO> {
        try {
            if(!user) {
                throw new UserNotAuthorized('You are not authorized to make this operation!');
            }
            return await this.handler.execute();
        } catch(err) {
            this.loggerError.error(err);
            if(err instanceof UserNotAuthorized) {
                throw HttpException.build(HttpStatusCode.FORBIDDEN, err.name, err.message);
            } else {
                throw HttpException.build(HttpStatusCode.INTERNAL_SERVER_ERROR, err.name, err.message);
            }
        }
    }

}