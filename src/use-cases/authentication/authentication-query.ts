import JWT, { SignOptions } from "jsonwebtoken";
import { IQueryHandler } from "../../components/query/query";
import { ILoginDTO, ITokenDTO } from "./authentication-dto";
import { generateSha512 } from "../../helper/crypto-util";
import { IKeyValueRepository } from "../../repository/key-value-repository/key-value-repository";
import { User } from "../../domains/user";
import { ILogger } from "../../components/logger/logger";
import { getLoggerStore } from "../../config/logger-config";
import { Logger } from "log4js";
import { ISchemaRepository } from "../../repository/schema-repository/schema-repository";
import { IUserModel } from "../../repository/user/mongo-user-repository";
import { UserNotFound } from "../../exceptions/users/user-not-found";

export class AuthenticationQueryHandler implements IQueryHandler<ILoginDTO, ITokenDTO> {

    logger: ILogger = getLoggerStore('system');
    loggerError: ILogger = getLoggerStore('systemError');

    static JWT_OPTIONS: SignOptions = {
        algorithm: "HS512",
        expiresIn: 60 * 60 * 1 // One hour to expires
    }
    
    private constructor(private repository: ISchemaRepository<User, IUserModel>) {
        this.execute = this.execute.bind(this);
    }

    static build(repository: ISchemaRepository<User, IUserModel>): AuthenticationQueryHandler {
        return new AuthenticationQueryHandler(repository);
    }
    
    async execute(query: ILoginDTO): Promise<ITokenDTO> {
        try {
            const userFound = await this.repository.findOne({email: query.email});
            if(!userFound) {
                throw new UserNotFound("Your email/password is invalid.");
            }
            const convertedPassowrd = generateSha512(query.password, userFound.salt);
            if(userFound.password !== convertedPassowrd) {
                throw new UserNotFound("Your email/password is invalid.");
            }
            const jwt = JWT.sign(
                {
                    name: userFound.name,
                    email: userFound.email
                },
                userFound.salt,
                AuthenticationQueryHandler.JWT_OPTIONS
            );
            return { access_token: jwt }
        } catch(err) {
            this.loggerError.error(err);
            throw err;
        }
    }
    
}