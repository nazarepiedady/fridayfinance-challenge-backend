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
`