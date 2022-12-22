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
    getBanks: [Account]
    getAccounts: [Account]
    getTransactions(
      ascOrder: Boolean, skip: Int, take: Int, selectedBank: String, selectedAccount: String!
    ): [Transaction]
  }

  type Mutation {
    updateTransactionCategory(categoryId: String!, transactionId: String!): Transaction
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
    },
    getBanks: (_parent: undefined, _args: undefined, context: Context) => {
      return context.prisma.account.findMany({
        distinct: ['bank'],
        select: { bank: true }
      })
    },
    getAccounts: (_parent: undefined, _args: undefined, context: Context) => {
      return context.prisma.account.findMany({
        distinct: ['name'],
        select: { name: true }
      })
    },
    getTransactions: (
      _parent: undefined,
      _args: {
        ascOrder?: boolean
        skip?: number
        take?: number
        selectedBank?: string
        selectedAccount?: string
      },
      context: Context
    ) => {
      const ascedentOrder = _args.ascOrder || false
      const skip = _args.skip || 0
      const take = _args.take || 20
      const selectedBank = _args.selectedBank || undefined
      const selectedAccount = _args.selectedAccount || undefined

      return context.prisma.transaction.findMany({
        take,
        skip,
        orderBy: { date: ascedentOrder ? 'asc' : 'desc' },
        include: { account: true, category: true },
        where: { account: { name: selectedAccount, bank: selectedBank } }
      })
    }
  },
  Mutation: {
    updateTransactionCategory: (
      _parent: undefined,
      _args: { categoryId: string, transactionId: string },
      context: Context
    ) => {
      return context.prisma.transaction.update({
        where: { id: _args.transactionId },
        data: { categoryId: _args.categoryId },
        include: { category: true, account: true }
      })
    }
  }
}