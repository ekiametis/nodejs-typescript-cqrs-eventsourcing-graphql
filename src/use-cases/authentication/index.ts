import { AuthenticationQueryHandler } from "./authentication-query";
import { AuthenticationDataSource } from "./authentication-datasource";
import { AuthenticationTypeDef, AuthenticationQueryDef } from "./authentication-typedef";
import { AuthenticationResolver } from "./authentication-resolver";
import { mongoUserRepository } from "../../repository";

const authenticationQueryHandler = AuthenticationQueryHandler.build(mongoUserRepository);
const authenticationDataSource = AuthenticationDataSource.build(authenticationQueryHandler);

export {
    AuthenticationTypeDef,
    AuthenticationQueryDef,
    AuthenticationResolver,
    authenticationQueryHandler,
    authenticationDataSource,
}