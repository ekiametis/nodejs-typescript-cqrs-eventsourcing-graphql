import { ApolloServer } from "apollo-server";
import datasource from "./datasource";
import resolvers from "./resolver";
import typeDefs from "./typedef";
import context from "./context";

export default new ApolloServer({ 
    typeDefs: typeDefs,
    resolvers: resolvers,
    dataSources: datasource,
    context: context,
});