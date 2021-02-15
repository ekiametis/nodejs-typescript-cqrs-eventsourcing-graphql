import { IRepository } from "../../components/repository/repository";
import { IDomain } from "../../components/domain/domain";
import { IDTO } from "../../components/dto/dto";

export interface ISchemaRepository<D extends IDomain, R extends IDTO> extends IRepository {
    create(entity: D): Promise<void>;
    find(entity: Partial<D>): Promise<Array<R>>;
    findOne(entity: Partial<D>): Promise<R>;
    delete(entity: Partial<D>): Promise<void>;
    update(query: Partial<D>, update: Partial<D>, options?: any): Promise<void>;
    remove(entity: Partial<D>): Promise<void>;
}