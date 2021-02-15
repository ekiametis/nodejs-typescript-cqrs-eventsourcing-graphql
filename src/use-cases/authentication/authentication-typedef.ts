export const AuthenticationTypeDef = `
    input ILoginDTO {
        email: String
        password: String
    }

    type ITokenDTO {
        access_token: String
    }
`

export const AuthenticationQueryDef = `
    login(login: ILoginDTO): ITokenDTO
`