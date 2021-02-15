export const InstallStationTypeDef = `
    input IInstallStationRequestDTO {
        stationName: String
        planetName: String
    }

    type IInstallStationResponseDTO {
        stationName: String
        planetName: String
    }
`;

export const InstallStationMutationDef = `
    installStation(input: IInstallStationRequestDTO): IInstallStationResponseDTO
`;