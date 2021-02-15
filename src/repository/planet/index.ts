import { MongoPlanetRepository } from "./mongo-planet-repository";
import { mongodbStoreDatabase, redisStoreDatabase } from "../../database";
import { RedisPlanetRepository } from "./redis-planet-repository";

export const mongoPlanetRepository = MongoPlanetRepository.build(mongodbStoreDatabase);
export const redisPlanetRepository = RedisPlanetRepository.build(redisStoreDatabase)