import { RESTDataSource } from "apollo-datasource-rest";
import { RegisterUserCommandHandler, RegisterUserCommand } from "./register-user-command";
import { IRegisterUserDTO } from "./register-user-dto";
import { ITokenDTO } from "../authentication/authentication-dto";
import { getLoggerStore } from "../../config/logger-config";
import { ILogger } from "../../components/logger/logger";
import { HttpException } from "../../exceptions/http/http-exception";
import { UserAlreadyExist } from "../../exceptions/users/user-already-exists";
import { UserPasswordInvalid } from "../../exceptions/users/user-password-invalid";
import { HttpStatusCode } from "../../enums/http-status-code";

export class RegisterUserDataSource extends RESTDataSource {

    loggerError: ILogger = getLoggerStore('systemError');

    private constructor(private handler: RegisterUserCommandHandler){
        super();
    }

    static build(handler: RegisterUserCommandHandler): RegisterUserDataSource {
        return new RegisterUserDataSource(handler);
    }

    async registerUser(dto: IRegisterUserDTO): Promise<ITokenDTO> {
        try {
            return await this.handler.execute(RegisterUserCommand.build(dto));
        } catch(err) {
            this.loggerError.error(err);
            if(err instanceof UserAlreadyExist) {
                throw HttpException.build(HttpStatusCode.CONFLICT, err.name, err.message);
            } else if(err instanceof UserPasswordInvalid) {
                throw HttpException.build(HttpStatusCode.BAD_REQUEST, err.name, err.message);
            } else {
                throw HttpException.build(HttpStatusCode.INTERNAL_SERVER_ERROR, err.name, err.message);
            }
        }
    }

}