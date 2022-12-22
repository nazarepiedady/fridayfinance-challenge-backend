import { context } from './context'
import { ApolloServer } from 'apollo-server';
import { resolvers, typeDefinitions } from './schema';


const server: ApolloServer = new ApolloServer(
  { resolvers, typeDefs: typeDefinitions, context }
)

server.listen({ port: 4000 }, () => {
  console.log(`🚀 Apollo Server is listening: http://localhost:4000`)
})