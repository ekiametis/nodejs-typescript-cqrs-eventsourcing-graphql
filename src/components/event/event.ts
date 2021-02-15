import { IDTO } from "../dto/dto";

export interface EventId {
    uniqueId: string;
    eventName: string;
}

export interface IEvent<D extends IDTO> {
    id: EventId;
    date: Date;
    data: D;
}

export interface IEventHandler<E extends IEvent<IDTO>> {
    eventName: string
    handle(event: E): Promise<void>;
}

export interface IEventStore {
    save(event: IEvent<IDTO>): Promise<void>
}

export interface IEventBus {
    addEventHandler(handler: IEventHandler<IEvent<IDTO>>): void;
    listen(): Promise<void>;
    publish(id: EventId, event: IEvent<IDTO>): Promise<void>
}

export interface IEventProjector {
    listen(): Promise<void>;
}