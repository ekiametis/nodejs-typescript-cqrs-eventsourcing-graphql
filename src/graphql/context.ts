import { MiddlewareUserAuthorization } from "../middlewares/middleware-user-authorization";
import { mongoUserRepository } from "../repository";

const middlewareUserAuthorization = MiddlewareUserAuthorization.build(mongoUserRepository);

export default async ({ req }) => {
    const access_token = <string> req.headers['access_token']
    const user = await middlewareUserAuthorization.validate(access_token);
    return { user }
}