export const ListStationTypeDef = `
    input IListStationRequestDTO {
        planetName: String
    }

    type IStationResponseDTO {
        planet: String
        stations: [String]
    }

    type IListStationResponseDTO {
        result: [IStationResponseDTO]!
    }
`;

export const ListStationQueryDef = `
    stations(input: IListStationRequestDTO!): IListStationResponseDTO
`