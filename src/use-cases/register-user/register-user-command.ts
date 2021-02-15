import JWT from "jsonwebtoken";
import { v4 as uuid } from 'uuid';
import { ICommand, ICommandHandler } from "../../components/command/command";
import { IRegisterUserDTO } from './register-user-dto';
import { UserRegisteredEvent } from './user-registered-event';
import { generateRandomString, generateSha512 } from '../../helper/crypto-util';
import { getLoggerStore } from '../../config/logger-config';
import { ILogger } from '../../components/logger/logger';
import { ITokenDTO } from '../authentication/authentication-dto';
import { AuthenticationQueryHandler } from "../authentication/authentication-query";
import { IKeyValueRepository } from "../../repository/key-value-repository/key-value-repository";
import { User } from "../../domains/user";
import { EventId, IEvent, IEventStore } from "../../components/event/event";
import { IDTO } from "../../components/dto/dto";
import { ISchemaRepository } from "../../repository/schema-repository/schema-repository";
import { IUserModel } from "../../repository/user/mongo-user-repository";
import { UserAlreadyExist } from "../../exceptions/users/user-already-exists";
import { UserPasswordInvalid } from "../../exceptions/users/user-password-invalid";

export class RegisterUserCommand implements ICommand<IRegisterUserDTO> {

    static NAME = "RegisterUserCommand";

    commandName = RegisterUserCommand.NAME;
    id: string;
    data: IRegisterUserDTO;

    private constructor(data: IRegisterUserDTO) {
        this.id = uuid();
        this.data = data;
    }

    static build(data: IRegisterUserDTO) {
        return new RegisterUserCommand(data);
    }
}

export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand> {

    static NAME = "RegisterUserCommandHandler";
    logger: ILogger = getLoggerStore('system');
    loggerError: ILogger = getLoggerStore('systemError');

    private constructor(private repository: ISchemaRepository<User, IUserModel>, private eventRepository: IKeyValueRepository<EventId, IEvent<IDTO>>, private eventStore: IEventStore){
        this.execute = this.execute.bind(this);
    }

    static build(repository: ISchemaRepository<User, IUserModel>, eventRepository: IKeyValueRepository<EventId, IEvent<IDTO>>, eventStore: IEventStore): RegisterUserCommandHandler {
        return new RegisterUserCommandHandler(repository, eventRepository, eventStore);
    }

    async execute(command: RegisterUserCommand): Promise<ITokenDTO> {
        try {
            this.logger.info(`Command is being executed: ${RegisterUserCommandHandler.NAME}`);
            this.logger.debug(`Command value: ${JSON.stringify(command)}`);
            const userFound = await this.repository.findOne({ email: command.data.email });
            const eventId = { uniqueId: command.data.email, eventName: UserRegisteredEvent.NAME }
            let event = await this.eventRepository.get(eventId);
            let salt;
            if(userFound && event) {
                throw new UserAlreadyExist("User already registered.");
            } else if(!userFound) {
                if(command.data.password !== command.data.passwordConfirmation){
                    throw new UserPasswordInvalid("Password does not match with password confirmation.");
                }
                salt = generateRandomString(20);
                const password = generateSha512(command.data.password, salt);
                const value = {
                    email: command.data.email,
                    name: command.data.name,
                    password,
                    salt,
                }
                event = UserRegisteredEvent.build(value);
            } else {
                salt = userFound.salt;
                event = UserRegisteredEvent.build(userFound);
            }
            await this.eventStore.save(event);
            const jwt = JWT.sign(
                {
                    name: command.data.name,
                    email: command.data.email
                },
                salt,
                AuthenticationQueryHandler.JWT_OPTIONS
            );
            return { access_token: jwt }
        } catch(err) {
            this.loggerError.error(err);
            throw err;
        }
    }

}