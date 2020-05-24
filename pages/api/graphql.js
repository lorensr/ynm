import { ApolloServer, gql } from 'apollo-server-micro'

const typeDefs = gql`
  type Query {
    users: [User!]!
  }
  type User {
    id: Int!
    firstName: String
  }
`

const resolvers = {
  Query: {
    users() {
      return [{ firstName: 'foo' }]
    },
  },
}

const apolloServer = new ApolloServer({ typeDefs, resolvers })

export default apolloServer.createHandler({ path: '/api/graphql' })

export const config = {
  api: {
    bodyParser: false,
  },
}
