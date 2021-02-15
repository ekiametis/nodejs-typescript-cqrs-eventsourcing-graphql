import { IListStationRequestDTO } from "./list-station-dto";
import { ITokenDTO } from "../authentication/authentication-dto";
import { HttpException } from "../../exceptions/http/http-exception";
import { ApolloError } from "apollo-server";

const stations = async (_source, { input }, { dataSources, user }) => {
    try {
        const userRequest = <ITokenDTO> user;
        let request: IListStationRequestDTO;
        if(input && input.planetName) {
            request = input;
        }
        return await dataSources.listStationDataSource.listStations(userRequest, request);
    } catch(err) {
        const error = <HttpException> err;
        throw new ApolloError(error.retrieveErrorMessage(), error.retrieveErrorCode(), error.formatToJSON());
    }
  }
  
export const ListStationResolver = {
    Query: {
        stations,
    }
};