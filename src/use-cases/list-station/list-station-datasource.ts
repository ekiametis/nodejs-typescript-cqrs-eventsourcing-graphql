import { RESTDataSource } from "apollo-datasource-rest";
import { IListStationResponseDTO, IListStationRequestDTO } from "./list-station-dto";
import { ListStationQueryHandler } from "./list-station-query";
import { getLoggerStore } from "../../config/logger-config";
import { ILogger } from "../../components/logger/logger";
import { ITokenDTO } from "../authentication/authentication-dto";
import { UserNotAuthorized } from "../../exceptions/users/user-not-authorized";
import { HttpException } from "../../exceptions/http/http-exception";
import { HttpStatusCode } from "../../enums/http-status-code";

export class ListStationDataSource extends RESTDataSource {

    loggerError: ILogger = getLoggerStore('systemError');

    private constructor(private handler: ListStationQueryHandler){
        super();
    }

    static build(handler: ListStationQueryHandler): ListStationDataSource {
        return new ListStationDataSource(handler);
    }

    async listStations(user: ITokenDTO, data: IListStationRequestDTO): Promise<IListStationResponseDTO> {
        try {
            if(!user) {
                throw new UserNotAuthorized('You are not authorized to make this operation!');
            }
            return await this.handler.execute(data);
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