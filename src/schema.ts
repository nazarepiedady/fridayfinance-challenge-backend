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
`