import { MongoUserRepository } from "./mongo-user-repository";
import { mongodbStoreDatabase, redisStoreDatabase } from "../../database";
import { RedisUserRepository } from "./redis-user-repository";

const mongoUserRepository = MongoUserRepository.build(mongodbStoreDatabase);
const redisUserRepository = RedisUserRepository.build(redisStoreDatabase);

export { mongoUserRepository, redisUserRepository }