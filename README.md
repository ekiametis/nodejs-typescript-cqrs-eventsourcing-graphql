It's a project I would like to show you the typescript code and my way to organize the project using CQRS + Event Sourcing + DDD + SOLID + Package-by-feature + Clean Code + GraphQL

# REQUIREMENTS

- Docker installed in your machine
- docker-compose installed in your machine

# HOW TO RUN?

```
git clone <THIS_REPOSITORY>
docker-compose build
docker-compose up
```

# 1. Structure

The project is splitted in a few folder, for example:

- 1. `src` - Is the main folder where the typescript code was written.
  - 1.1. `components` - It's a component folder where we can develop our abstractions to implement some pattern or system behaviour, for example: logger, tracing, metrics. This folder is a strong candidate to be a npm module.
  - 1.2. `config` - All configurations we have to load on this project are located in this folder.
  - 1.3. `database` - Connections among databases are built in this folder, for example can be contructed some wrappers to connect with different types of storages.
  - 1.4. `domains` - Is the place where the domains are located.
  - 1.5. `enums` - All the enumarators are located here.
  - 1.6. `event` - In this folder there are some important components do develop EventSourcing concept. We have EventBus to send and receive messages, Event Projector to register all the event listeners and Event Store to store all the events.
  - 1.7. `exceptions` - This is the folder where we can build and put our custom errors.
  - 1.8. `graphql` - Folder which has some compoenents as datasources, resolvers, context and type definitions of GraphQL
  - 1.9. `helper` - Help functions.
  - 1.10. `integration` - Folder responsible to supply files which integrate with another services.
  - 1.11. `middlewares` - All middlewares can be put here.
  - 1.12. `repositories` - Every kind of persistence layer can be added here, for example, a file repository, a database repository or whatever you want to persist/retrieve/manipualte.
  - 1.13. `use-cases` - It's a folder structured based on the pattern "Package-by-feature" reflecting a feature in the application written by use cases, but it could be a user story, or adapted to a feature of the system. In this folder I'll write the controller, the use case bussiness service, the data tranfer object to convert data and the test specification. By this way we can notice and develop high cohesion code and split our system modules in a good format respecting SOLID principles.
  - 1.14. `utils` - Folder with which includes many kinds of utility functions.

# 2. GraphQL

This service was develop to provide some resources to demonstrate the use of GraphQL showing how to manipulate some queries and mutations. This is just an example to show some possibilities to consume services when you are using HTTP protocol. Some resources was developed to register an user and make login, others requires authentication to be consumed. Below there is some examples of resources that this application supplies:

- `(MUTATION) registerUser` - This is the resource to register a new user for consume another resources.
- `(QUERY) login` - This is the resource responsible to authenticate and give an access token to the user consume another resources.
- `(QUERY) suitablePlanets` - This is the resource responsible to supply a list of exoplanets suitable to install some stations. This resource behind the scenes consumes another service provides by the NASA where we can find out all the planets discovered by the NASA and we are letting available just planets which have more than 10 jupiter mass.
- `(MUTATION) installSatation` - All suitable planets are passive of stations install. So it's the resource responsible to install a station in some planet.
- `(QUERY) stations` - All installed stations can be retrieved by this resource grouped by planets. So we can retrieve stations installed on their planets.

# 3. Some features used

Some features were used to demonstrate the ability to improve your service using some concepts like:

- `CQRS`: Command Query Responsibility Segregation, where there is a write database which stores all the events and read databases to store domain data and make possible queries.
- `Event Sourcing`: Events stored in the sequence they were happening.
- `Logging`: When you are writing services or microservice it's a good approach provide logs, because it helps a lot in dev mode and whe your application is on production, to identify more quickly some possible problems.
- `Errors`: It's very good to make your exceptions or error classes to describe better when a problem occurs. But joinned with this concept, when you are designing your resources, think in a way to map and write your business errors, standardizing your return and trying to describe your errors and detailed errors if it would the case.

All this concepts above are primordial things that I think it's very important when you are coding some service or microservice which provide REST resources. `Concepts mentioned above were implemented here on this project` :)

# Notes

1. All the events published on eventbus were not made to be commited/ack to demonstrate the event sourcing reprocessing. It's just a didactic way to demonstrate this behaviour.

# TODO

Some important things I would like to add in this service are:

- To fullfill all the operations with a context to make possible the use of tracing between the operations (command, queries, events)
- When a context will be added for every operation make possible the logger print every correlationId associate with those operations.
- Make unit tests using JEST or Mocha with ChaiJS NockJS SinonJS
- Register some metrics using a library to communicate with prometheus for example to make possible the visibility of business charts or operation charts on Grafana.
- Implementing some resources to check the health and availability of the microservice, for example checking the health of infrastructure components communication as RabbitMQ, MongoDB, Redis, required environment variables, etc.