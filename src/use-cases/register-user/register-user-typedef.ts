export const RegisterUserTypeDef = `
    input IRegisterUserDTO {
        email: String
        password: String
        passwordConfirmation: String
        name: String
    }
`;

export const RegisterUserMutationDef = `
    registerUser(user: IRegisterUserDTO): ITokenDTO
`