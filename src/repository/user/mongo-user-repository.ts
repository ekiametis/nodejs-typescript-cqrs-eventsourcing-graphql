import { Mongoose, Model, Document } from "mongoose";
import { MongoWrapper } from "../../database/mongodb/mongodb";
import { User } from "../../domains/user";
import { ISchemaRepository } from "../schema-repository/schema-repository";
import { getLoggerStore } from "../../config/logger-config";
import { ILogger } from "../../components/logger/logger";
import { IDTO } from "../../components/dto/dto";

export const UserSchema = {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
}

export interface IUserModel extends User, Document, IDTO {}

export class MongoUserRepository implements ISchemaRepository<User, IUserModel> {

    static MODEL_NAME = "User";
    
    connection: Mongoose;
    model: Model<IUserModel>;
    logger: ILogger = getLoggerStore('system');
    loggerError: ILogger = getLoggerStore('systemError');

    private constructor(private mongodb: MongoWrapper) {
        this.connection = this.mongodb.getConnection();
        const { Schema } = this.connection;
        this.model = this.connection.model<IUserModel>(MongoUserRepository.MODEL_NAME, new Schema(UserSchema));
    }

    static build(mongodb: MongoWrapper): MongoUserRepository {
        return new MongoUserRepository(mongodb);
    }

    async create(entity: User): Promise<void> {
        await this.model.create(entity);
    }
    async find(entity: Partial<User>): Promise<IUserModel[]> {
        return await this.model.find(entity);
    }
    async findOne(entity: Partial<User>): Promise<IUserModel> {
        return await this.model.findOne(entity)
    }
    async delete(entity: Partial<User>): Promise<void> {
        this.model.remove(entity);
    }
    async update(query: Partial<User>, update: Partial<User>, options?: any): Promise<void> {
        this.model.update(query,update); 
    }
    async remove(entity: Partial<User>): Promise<void> {
        this.model.remove(entity);
    }
}