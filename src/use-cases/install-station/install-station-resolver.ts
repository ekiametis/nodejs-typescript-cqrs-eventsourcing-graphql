import { IInstallStationRequestDTO } from "./install-station-dto";
import { ITokenDTO } from "../authentication/authentication-dto";
import { HttpException } from "../../exceptions/http/http-exception";
import { ApolloError } from "apollo-server";

const installStation = async (_source, { input }, { dataSources, user }) => {
    try {
        const userRequest = <ITokenDTO> user;
        const installStationRequest: IInstallStationRequestDTO = input;
        return await dataSources.installStationDataSource.installStation(userRequest, installStationRequest);
    } catch(err) {
        const error = <HttpException> err;
        throw new ApolloError(error.retrieveErrorMessage(), error.retrieveErrorCode(), error.formatToJSON());
    }
  }
  
export const InstallStationResolver = {
    Mutation: {
        installStation,
    }
};