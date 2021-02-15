import { RetrieveSuitablePlanetsIntegration } from "./retrieve-suitable-planets-integration";
import { redisPlanetRepository } from "../../repository/planet";

const ONE_MINUTE = 1000 * 60;
const CACHE_TIME_MS_NASA_ENDPOINT = Number(process.env.CACHE_TIME_MS_NASA_ENDPOINT || ONE_MINUTE);

export const retrieveSuitablePlanetsDataSource = RetrieveSuitablePlanetsIntegration.build(redisPlanetRepository, CACHE_TIME_MS_NASA_ENDPOINT);