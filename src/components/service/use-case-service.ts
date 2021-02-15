import { IDTO } from "../dto/dto";

export interface IUseCaseService<RequestDTO extends IDTO, ResponseDTO extends IDTO> {
    execute(requestData: RequestDTO): Promise<ResponseDTO>;
}