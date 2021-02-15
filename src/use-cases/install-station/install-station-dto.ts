import { IDTO } from "../../components/dto/dto";

export interface IInstallStationRequestDTO extends IDTO {
    stationName: string;
    planetName: string;
}

export interface IInstallStationResponseDTO extends IDTO {
    stationName: string;
    planetName: string;
}

interface Planet {
    name: string;
    mass: number;
}

export interface IStationInstalledDTO {
    name: string;
    planet: Planet;
}