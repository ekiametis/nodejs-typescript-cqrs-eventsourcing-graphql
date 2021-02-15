export interface IRegisterUserDTO {
    email: string;
    password: string;
    passwordConfirmation: string;
    name: string;
}

export interface IUserRegisteredDTO {
    email: string;
    password: string;
    salt: string;
    name: string;
}