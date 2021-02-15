import { IDTO } from "../../components/dto/dto";

export interface IListStationRequestDTO {
    planetName?: string
}

export interface IStationResponseDTO extends IDTO {
    planet: string
    stations: Array<string>;
}

export interface IListStationResponseDTO extends IDTO {
    result: Array<IStationResponseDTO>;
}