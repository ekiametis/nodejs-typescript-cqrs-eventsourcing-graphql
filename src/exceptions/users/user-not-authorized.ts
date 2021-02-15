export class UserNotAuthorized extends Error {

    constructor(message: string){
        super(message);
    }
}