import { RabbitMQEventBus } from "./event-bus/rabbitmq-event-bus";
import { RabbitMQEventStore } from "./event-store/rabbit-mq-event-store";
import { redisEventRepository } from "../repository"
import { RabbitMQEventProjector } from "./event-projector/rabbitmq-event-projector";

const RABBIT_MQ_HOST = process.env.RABBIT_MQ_HOST;

const rabbitMQEventBus = RabbitMQEventBus.build(RABBIT_MQ_HOST);
const rabbitMqEventStore = RabbitMQEventStore.build(redisEventRepository, rabbitMQEventBus);
const rabbitMqProjector = RabbitMQEventProjector.build(rabbitMQEventBus);
rabbitMqProjector.listen();

export {
    rabbitMQEventBus,
    rabbitMqEventStore,
    rabbitMqProjector,
}