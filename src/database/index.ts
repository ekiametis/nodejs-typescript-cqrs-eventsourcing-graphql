import { RedisWrapper } from "./redis/redis";
import { MongoWrapper } from "./mongodb/mongodb";

const REDIS_EVENT_STORE_HOST = process.env.REDIS_EVENT_STORE_HOST;
const REDIS_EVENT_STORE_PORT = Number(process.env.REDIS_EVENT_STORE_PORT);
const REDIS_EVENT_STORE_PASSWORD = process.env.REDIS_EVENT_STORE_PASSWORD;
const REDIS_READ_STORE_HOST = process.env.REDIS_READ_STORE_HOST;
const REDIS_READ_STORE_PORT = Number(process.env.REDIS_READ_STORE_PORT);
const REDIS_READ_STORE_PASSWORD = process.env.REDIS_READ_STORE_PASSWORD;
const MONGODB_READ_STORE_URL_CONNECTION = process.env.MONGODB_READ_STORE_URL_CONNECTION;

const eventStoreDatabase = RedisWrapper.build({
    host: REDIS_EVENT_STORE_HOST,
    port: REDIS_EVENT_STORE_PORT,
    password: REDIS_EVENT_STORE_PASSWORD
});
const redisStoreDatabase = RedisWrapper.build({
    host: REDIS_READ_STORE_HOST,
    port: REDIS_READ_STORE_PORT,
    password: REDIS_READ_STORE_PASSWORD
});
const mongodbStoreDatabase = MongoWrapper.build(
    MONGODB_READ_STORE_URL_CONNECTION,
    {
        useNewUrlParser: true,
        useUnifiedTopology:true
    }
);

export { 
    eventStoreDatabase,
    redisStoreDatabase,
    mongodbStoreDatabase,
}