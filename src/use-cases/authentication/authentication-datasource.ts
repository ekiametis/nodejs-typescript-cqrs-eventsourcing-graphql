import { RESTDataSource } from "apollo-datasource-rest";
import { AuthenticationQueryHandler } from "./authentication-query";
import { ILoginDTO, ITokenDTO } from "./authentication-dto";
import { getLoggerStore } from "../../config/logger-config";
import { ILogger } from "../../components/logger/logger";
import { HttpException } from "../../exceptions/http/http-exception";
import { HttpStatusCode } from "../../enums/http-status-code";
import { UserNotFound } from "../../exceptions/users/user-not-found";

export class AuthenticationDataSource extends RESTDataSource {

    loggerError: ILogger = getLoggerStore('systemError');

    private constructor(private handler: AuthenticationQueryHandler){
        super();
    }

    static build(handler: AuthenticationQueryHandler): AuthenticationDataSource {
        return new AuthenticationDataSource(handler);
    }

    async login(dto: ILoginDTO): Promise<ITokenDTO> {
        try {
            return await this.handler.execute(dto);
        } catch(err) {
            this.loggerError.error(err);
            if(err instanceof UserNotFound) {
                throw HttpException.build(HttpStatusCode.FORBIDDEN, err.name, err.message);
            } else {
                throw HttpException.build(HttpStatusCode.INTERNAL_SERVER_ERROR, err.name, err.message);
            }
        }
    }
}