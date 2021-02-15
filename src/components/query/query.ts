import { IDTO } from "../dto/dto";

export interface IQueryHandler<REQUEST extends IDTO, RESPONSE extends IDTO> {

    execute(query: REQUEST): Promise<RESPONSE>;
}