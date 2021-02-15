import { IDTO } from "../../components/dto/dto";

export interface SuitablePlanetDTO extends IDTO {
    name: string;
    mass: number;
    hasStation: boolean;
}

export interface IListSuitablePlanetResponseDTO extends IDTO {
    suitablePlanets: Array<SuitablePlanetDTO>;
}