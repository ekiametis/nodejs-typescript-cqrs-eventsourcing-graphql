import { RegisterUserTypeDef, RegisterUserMutationDef } from './register-user-typedef';
import { RegisterUserResolver } from './register-user-resolver';
import { RegisterUserCommandHandler } from './register-user-command';
import { RegisterUserDataSource } from './register-user-datasource';
import { mongoUserRepository, redisEventRepository } from '../../repository'
import { rabbitMqEventStore } from '../../event';

const registerUserCommandHadler = RegisterUserCommandHandler.build(mongoUserRepository, redisEventRepository, rabbitMqEventStore);
const registerUserDataSource = RegisterUserDataSource.build(registerUserCommandHadler);

export {
    RegisterUserTypeDef,
    RegisterUserMutationDef,
    RegisterUserResolver,
    registerUserCommandHadler,
    registerUserDataSource,
}