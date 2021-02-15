export const ListSuitablePlanetTypeDef = `
    type SuitablePlanetDTO {
        name: String
        mass: Float
        hasStation: Boolean
    }

    type IListSuitablePlanetResponseDTO {
        suitablePlanets: [SuitablePlanetDTO]!
    }
`;

export const ListSuitablePlanetQueryDef = `
    suitablePlanets: IListSuitablePlanetResponseDTO
`