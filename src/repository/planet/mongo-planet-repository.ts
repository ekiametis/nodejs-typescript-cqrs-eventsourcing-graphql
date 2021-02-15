import { ISchemaRepository } from "../schema-repository/schema-repository";
import { IDTO } from "../../components/dto/dto";
import { Planet } from "../../domains/planet";
import { Mongoose, Model, Document } from "mongoose";
import { ILogger } from "../../components/logger/logger";
import { getLoggerStore } from "../../config/logger-config";
import { MongoWrapper } from "../../database/mongodb/mongodb";

export const PlanetSchema = {
    name: { type: String, required: true, unique: true },
    mass: { type: Number, required: false },
}

export interface IPlanetModel extends Planet, Document, IDTO {
    hasStation: boolean
}

export class MongoPlanetRepository implements ISchemaRepository<Planet, IPlanetModel> {

    static MODEL_NAME = "Planet";
    
    model: Model<IPlanetModel>;
    connection: Mongoose;
    logger: ILogger = getLoggerStore('system');
    loggerError: ILogger = getLoggerStore('systemError');
    
    private constructor(private mongodb: MongoWrapper) {
        this.connection = this.mongodb.getConnection();
        const { Schema } = this.connection;
        this.model = this.connection.model<IPlanetModel>(MongoPlanetRepository.MODEL_NAME, new Schema(PlanetSchema));
    }

    static build(mongodb: MongoWrapper): MongoPlanetRepository {
        return new MongoPlanetRepository(mongodb);
    }
    
    create(entity: Planet): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async find(entity: Partial<Planet>): Promise<IPlanetModel[]> {
        return await this.model.find(entity);
    }
    findOne(entity: Partial<Planet>): Promise<IPlanetModel> {
        throw new Error("Method not implemented.");
    }
    delete(entity: Partial<Planet>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    update(query: Partial<Planet>, update: Partial<Planet>, options?: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    remove(entity: Partial<Planet>): Promise<void> {
        throw new Error("Method not implemented.");
    }

}