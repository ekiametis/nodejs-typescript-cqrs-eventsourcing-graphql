import { IRepository } from "../../components/repository/repository";
import { IDomain } from "../../components/domain/domain";

export interface IKeyValueRepository<ID, VALUE extends IDomain> extends IRepository {

    set(id: ID, value: VALUE, options?: any): Promise<void>;
    get(id: ID): Promise<VALUE>;
}