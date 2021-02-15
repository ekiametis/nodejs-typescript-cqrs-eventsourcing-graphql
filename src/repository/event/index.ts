import { RedisEventRepository } from "./redis-event-repository";
import { eventStoreDatabase } from "../../database";

export const redisEventRepository = RedisEventRepository.build(eventStoreDatabase);