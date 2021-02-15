import { IRegisterUserDTO } from "./register-user-dto";
import { ApolloError } from "apollo-server";
import { HttpException } from "../../exceptions/http/http-exception";

const registerUser = async (_source, { user }, { dataSources }) => {
    try {
        const userRequest: IRegisterUserDTO = user;
        return await dataSources.registerUserDataSource.registerUser(userRequest);
    } catch(err) {
        const error = <HttpException> err;
        throw new ApolloError(error.retrieveErrorMessage(), error.retrieveErrorCode(), error.formatToJSON());
    }
}
  
export const RegisterUserResolver = {
    Mutation: {
        registerUser,
    }
};