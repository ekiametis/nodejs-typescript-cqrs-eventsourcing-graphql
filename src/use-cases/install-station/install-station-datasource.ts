import { RESTDataSource } from "apollo-datasource-rest";
import { ICommandHandler } from "../../components/command/command";
import { InstallStationCommand } from "./install-station-command";
import { IInstallStationRequestDTO, IInstallStationResponseDTO } from "./install-station-dto";
import { ITokenDTO } from "../authentication/authentication-dto";
import { UserNotAuthorized } from "../../exceptions/users/user-not-authorized";
import { HttpException } from "../../exceptions/http/http-exception";
import { HttpStatusCode } from "../../enums/http-status-code";
import { StationAlreadyExist } from "../../exceptions/station/station-already-exist";
import { PlanetNotExist } from "../../exceptions/planets/planet-not-exist";
import { getLoggerStore } from "../../config/logger-config";
import { ILogger } from "../../components/logger/logger";

export class InstallStationDataSource extends RESTDataSource {

    loggerError: ILogger = getLoggerStore('systemError');
    
    private constructor(private handler: ICommandHandler<InstallStationCommand>){
        super();
    }

    static build(commandHandler: ICommandHandler<InstallStationCommand>): InstallStationDataSource {
        return new InstallStationDataSource(commandHandler);
    }

    async installStation(user: ITokenDTO, dto: IInstallStationRequestDTO): Promise<IInstallStationResponseDTO> {
        try {
            if(!user) {
                throw new UserNotAuthorized('You are not authorized to make this operation!');
            }
            return await this.handler.execute(InstallStationCommand.build(dto));
        } catch(err) {
            this.loggerError.error(err);
            if(err instanceof UserNotAuthorized) {
                throw HttpException.build(HttpStatusCode.FORBIDDEN, err.name, err.message);
            } else if(err instanceof StationAlreadyExist) {
                throw HttpException.build(HttpStatusCode.CONFLICT, err.name, err.message);
            } else if(err instanceof PlanetNotExist) {
                throw HttpException.build(HttpStatusCode.BAD_REQUEST, err.name, err.message);
            } else {
                throw HttpException.build(HttpStatusCode.INTERNAL_SERVER_ERROR, err.name, err.message);
            }
        }
    }
}