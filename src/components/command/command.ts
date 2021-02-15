import { IDTO } from "../dto/dto";

export interface ICommand<D extends IDTO> {
    id: string;
    commandName: string;
    data: D;
}

export interface ICommandHandler<C extends ICommand<IDTO>> {

    execute(command: C): Promise<any>;
}