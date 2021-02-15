import { MongoStationRepository } from "./mongo-station-repository";
import { mongodbStoreDatabase } from "../../database";

export const mongoStationRepository = MongoStationRepository.build(mongodbStoreDatabase);