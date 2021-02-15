import { IEventBus, IEvent, EventId, IEventHandler } from "../../components/event/event";
import { IDTO } from "../../components/dto/dto";
import amqp from 'amqplib/callback_api';
import { getLoggerStore } from "../../config/logger-config";
import { ILogger } from "../../components/logger/logger";

interface RabbitMQValue {
    event: IEvent<IDTO>;
    channel: any;
}

export class RabbitMQEventBus implements IEventBus {

    events: WeakMap<EventId, RabbitMQValue>;
    eventHandlers: Map<string, IEventHandler<IEvent<IDTO>>>;
    options: any;
    connectionHost: string;
    connection: any;
    channel: any;
    logger: ILogger = getLoggerStore('system');
    loggerError: ILogger = getLoggerStore('systemError');

    private constructor(connectionHost: string, options: any){
        this.options = options;
        this.connectionHost = connectionHost;
        this.events = new WeakMap<EventId, RabbitMQValue>();
        this.eventHandlers = new Map<string, IEventHandler<IEvent<IDTO>>>();
        this.publish = this.publish.bind(this);
        this.connect = this.connect.bind(this);
        this.createChannel = this.createChannel.bind(this);
    }

    addEventHandler(handler: IEventHandler<IEvent<IDTO>>): void {
        this.eventHandlers.set(handler.eventName, handler);
    }

    async listen(): Promise<void> {
        if(!this.connection) {
            this.connection = await this.connect(this.connectionHost, this.options);
        }
        if(!this.channel){
            this.channel = await this.createChannel(this.connection)
        }
        this.eventHandlers.forEach(eventHandler => {
            this.logger.info(`RabbitMQEventBus: ${eventHandler.eventName} has been started`);
            this.channel.assertQueue(eventHandler.eventName);
            this.channel.consume(eventHandler.eventName, (message) => {
                eventHandler.handle(JSON.parse(message.content.toString('utf8')));
            })
        })
    }

    static build(connection: string, options?: any): RabbitMQEventBus {
        return new RabbitMQEventBus(connection, options);
    }

    async publish(eventId: EventId, event: IEvent<IDTO>): Promise<void> {
        this.logger.info(`Publishing event with name ${eventId.eventName} and uniqueId ${eventId.uniqueId}`);
        if(!this.connection) {
            this.connection = await this.connect(this.connectionHost, this.options);
        }
        if(!this.channel){
            this.channel = await this.createChannel(this.connection)
        }
        if(!this.events.get(eventId)){
            this.events.set(eventId, { event, channel: this.channel });
        }
        const currentEvent = this.events.get(eventId);
        currentEvent.channel.sendToQueue(eventId.eventName, Buffer.from(JSON.stringify(event)));
        this.logger.info(`Event with name ${eventId.eventName} and uniqueId ${eventId.uniqueId} published with success`);
    }

    private async createChannel(connection: any) {
        return new Promise((resolve, reject) => {
            connection.createChannel((err, channel) => {
                if(err) {
                    this.loggerError.error(err);
                    reject(err);
                } else {
                    resolve(channel);
                }
            })
        });
    }

    private async connect(connection: string, options: any): Promise<any> {
        return new Promise((resolve, reject) => {
            amqp.connect(connection, (err, connection) => {
                if(err) {
                    this.loggerError.error(err);
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        });
    }
}