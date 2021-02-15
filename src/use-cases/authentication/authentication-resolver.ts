import { ILoginDTO } from "./authentication-dto";
import { HttpException } from "../../exceptions/http/http-exception";
import { ApolloError } from "apollo-server";

const login = async (_source, { login }, { dataSources }) => {
    try {
        const loginRequest: ILoginDTO = login;
        return await dataSources.authenticationDataSource.login(loginRequest);
    } catch(err) {
        const error = <HttpException> err;
        throw new ApolloError(error.retrieveErrorMessage(), error.retrieveErrorCode(), error.formatToJSON());
    }
}

export const AuthenticationResolver = {
    Query: {
        login
    }
}