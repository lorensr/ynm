import { ApolloServer, gql } from 'apollo-server-micro'
import { EmailAddressResolver, DateTimeResolver } from 'graphql-scalars'

import { connectToDatabase } from '../../server/db'

let db

const typeDefs = gql`
  scalar EmailAddress
  scalar DateTime

  type Query {
    me: User
    ynm(slug: String!): YesNoMaybe
  }

  input CreateYnmInput {
    slug: String!
    displayName: String
    # answers: [AnswerInput!]!
  }

  input AnswerInput {
    questionId: ID!
    response: Response
    note: String
  }

  input UpsertAnswerInput {
    ynmId: ID!
    questionId: ID!
    response: Response
    note: String
  }

  input DeleteAnswerInput {
    ynmId: ID!
    questionId: ID!
  }

  input EditSlugInput {
    ynmId: ID!
    newSlug: String!
  }

  type Mutation {
    createYnm(input: CreateYnmInput!): YesNoMaybe!
    deleteYnm(id: ID!): Boolean!
    upsertAnswer(input: UpsertAnswerInput!): YesNoMaybe!
    deleteAnswer(input: DeleteAnswerInput!): YesNoMaybe!
    editSlug(input: EditSlugInput!): YesNoMaybe!
    deleteSlug(ynmId: ID!): YesNoMaybe!
  }

  type User {
    id: ID!
    email: EmailAddress!
    ynms: [YesNoMaybe!]!
    sharedWithMe: [YesNoMaybe!]!
    createdAt: DateTime!
  }

  type YesNoMaybe {
    id: ID!
    displayName: String
    slug: String
    answers(includeSkipped: Boolean = false): [Answer!]!
    viewedBy: [User!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum Response {
    YES
    NO
    MAYBE
  }

  type Answer {
    questionId: ID!
    response: Response
    note: String
    skipped: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`

const resolvers = {
  EmailAddress: EmailAddressResolver,
  DateTime: DateTimeResolver,

  Query: {
    ynm(_, { slug }, { db }) {
      return db.collection('ynms').findOne({ slug })
    },
  },

  Mutation: {
    async createYnm(_, { input }, { db, user, loggedIn }) {
      if (!loggedIn) {
        // throw new AuthorizationError()
      }

      const result = await db.collection('ynms').insertOne(input)
      input.id = result.insertedId
      return input
    },
    deleteYnm(_, { id }, { db, user }) {},
    upsertAnswer(_, { input }, { db, user }) {},
    deleteAnswer(_, { input }, { db, user }) {},
    editSlug(_, { input }, { db, user }) {},
    deleteSlug(_, { ynmId }, { db, user }) {},
  },

  User: {},

  Answer: {
    skipped(answer) {
      return !!answer.response
    },
  },
}

const context = async (req, res) => {
  // const jwt = req.headers.Authorization
  const user = { id: '1' }
  return {
    user,
    loggedIn: !!user,
    db: await connectToDatabase(),
  }
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  formatError: console.log,
  introspection: true,
  playground: true,
})

export default apolloServer.createHandler({ path: '/api/graphql' })

export const config = {
  api: {
    bodyParser: false,
  },
}
