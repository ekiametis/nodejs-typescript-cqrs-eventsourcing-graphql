export class UserAlreadyExist extends Error {

    constructor(message: string){
        super(message);
    }
}