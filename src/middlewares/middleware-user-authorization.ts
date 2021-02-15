import JWT from "jsonwebtoken";
import { ISchemaRepository } from "../repository/schema-repository/schema-repository";
import { IUserModel } from "../repository/user/mongo-user-repository";
import { User } from "../domains/user";
import { IDTO } from "../components/dto/dto";
import { AuthenticationError } from "apollo-server";

export interface UserAuthorizedDTO extends IDTO {
    email: string;
    name: string;
}

export class MiddlewareUserAuthorization {

    private constructor(private repository: ISchemaRepository<User, IUserModel>) {}

    static build(repository: ISchemaRepository<User, IUserModel>): MiddlewareUserAuthorization {
        return new MiddlewareUserAuthorization(repository)
    }

    async validate(access_token?: string): Promise<UserAuthorizedDTO> {
        if(!access_token) {
            return;
        }
        const userData = <UserAuthorizedDTO> JWT.decode(access_token, { complete: false, json: true });
        if(!userData || !userData.name || !userData.email) {
            throw new AuthenticationError('Access token invalid!')
        }
        const userFound = await this.repository.findOne({ email: userData.email });
        if(!userFound) {
            throw new AuthenticationError('Access token invalid!')
        }
        const userValidated = <UserAuthorizedDTO> JWT.verify(access_token, userFound.salt, { complete: false });
        if(!userValidated) {
            throw new AuthenticationError('Access token invalid!');
        }
        return userValidated;
    }
}