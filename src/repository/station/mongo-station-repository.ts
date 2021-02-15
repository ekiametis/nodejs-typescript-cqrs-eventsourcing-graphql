import { ISchemaRepository } from "../schema-repository/schema-repository";
import { IDTO } from "../../components/dto/dto";
import { Station } from "../../domains/station";
import { MongoWrapper } from "../../database/mongodb/mongodb";
import { Mongoose, Document, Model } from "mongoose";
import { ILogger } from "../../components/logger/logger";
import { getLoggerStore } from "../../config/logger-config";

const PlanetSchema = {
    name: { type: String, required: true },
    mass: { type: String, required: true },
}

export const StationSchema = {
    name: { type: String, required: true, unique: true },
    planet: { type: PlanetSchema, required: true },
}

export interface IStationModel extends Station, Document, IDTO {}

export interface IStationAggroupedByPlanetModel extends Document, IDTO {
    planet: string;
    stations: Array<string>;
}

export interface StationRepository extends ISchemaRepository<Station, IStationModel> {
    aggregateStationsByPlanets(planetName?: string): Promise<Array<IStationAggroupedByPlanetModel>>;
}

export class MongoStationRepository implements StationRepository {
    
    static MODEL_NAME = 'Station';

    model: Model<IStationModel>
    connection: Mongoose;
    logger: ILogger = getLoggerStore('system');
    loggerError: ILogger = getLoggerStore('systemError');

    private constructor(private mongodb: MongoWrapper){
        this.connection = this.mongodb.getConnection();
        const { Schema } = this.connection;
        this.model = this.connection.model<IStationModel>(MongoStationRepository.MODEL_NAME, new Schema(StationSchema));
    }

    static build(mongodb: MongoWrapper): MongoStationRepository {
        return new MongoStationRepository(mongodb);
    }
    
    async create(entity: Station): Promise<void> {
        await this.model.create(entity);
    }
    async find(entity: Partial<Station>): Promise<IStationModel[]> {
        return await this.model.find(entity);
    }
    async findOne(entity: Partial<Station>): Promise<IStationModel> {
        return await this.model.findOne(entity);
    }
    delete(entity: Partial<Station>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    update(query: Partial<Station>, update: Partial<Station>, options?: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    remove(entity: Partial<Station>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async aggregateStationsByPlanets(planetName?: string): Promise<IStationAggroupedByPlanetModel[]> {
        const match = {
            $match: { 'planet.name': planetName } 
        }
        const group = {
            $group: {
                _id: {
                    planet: '$planet.name'
                },
                stations : {
                    $addToSet : "$name"
                },
            }
        }
        const project = {
            $project: {
                _id: false,
                planet: '$_id.planet',
                stations: '$stations',
            }
        }
        const steps = []
        if(planetName) {
            steps.push(match);
        }
        steps.push(group);
        steps.push(project);
        return await this.model.aggregate(steps);
    }
}