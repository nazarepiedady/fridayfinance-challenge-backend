import { gql } from 'apollo-server';
import { v4 as UUIDV4 } from 'uuid';
import { Context } from './context';


export const typeDefinitions = gql`
  type Account {
    id: String!
    name: String!
    bank: String!
    transactions: [Transaction]
  }

  type Category {
    id: String!
    name: String!
    color: String
    transactions: [Transaction]
  }

  type Transaction {
    id: String!
    accountId: String!
    categoryId: String!
    reference: String!
    amount: Float!
    currency: String!
    date: String!
    account: Account!
    category: Category!
  }

  type Query {
    getTransactionById(id: String!): Transaction
    getCategories: [Category]
  }
`

export const resolvers = {
  Query: {
    getTransactionById: (_parent: undefined, args: { id: string }, context: Context) => {
      return context.prisma.transaction.findUnique({
        where: { id: args.id },
        include: { account: true, category: true }
      })
    },
    getCategories: (_parent: undefined, _args: undefined, context: Context) => {
      return context.prisma.category.findMany()
    }
  }
}