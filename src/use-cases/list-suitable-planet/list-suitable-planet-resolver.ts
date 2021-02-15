import { HttpException } from "../../exceptions/http/http-exception";
import { ApolloError } from "apollo-server";
import { ITokenDTO } from "../authentication/authentication-dto";

const suitablePlanets = async (_source, _, { dataSources, user }) => {
    try {
        const userRequest = <ITokenDTO> user;
        return await dataSources.listSuitablePlanetDataSource.listSuitablePlanets(userRequest);
    } catch(err) {
        const error = <HttpException> err;
        throw new ApolloError(error.retrieveErrorMessage(), error.retrieveErrorCode(), error.formatToJSON());
    }
  }
  
export const ListSuitablePlanetResolver = {
    Query: {
        suitablePlanets,
    }
};