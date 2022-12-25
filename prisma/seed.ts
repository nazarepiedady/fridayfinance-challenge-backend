const fileSystem = require('fs')
import { parseStream as CSVParserStream } from 'fast-csv'
import { PrismaClient, Account, Category, Transaction } from '@prisma/client'


const prisma = new PrismaClient()

function getFilePath(filename: string): string {
  return `./seeds/${filename}`
}

function getAccounts(): Promise<Account[]> {
  let accounts: Account[] = []
  let filename: string = 'accounts.csv'

  return new Promise((resolve, reject) => {
    const accountsFromFile = fileSystem.createReadStream(getFilePath(filename))
    CSVParserStream(accountsFromFile, { headers: true })
      .on('error', (error: Error) => reject(error))
      .on('data', (account: Account) => accounts.push(account))
      .on('end', () => resolve(accounts))
  })
}

function getCategories(): Promise<Category[]> {
  let categories: Category[] = []
  let filename: string = 'categories.csv'

  return new Promise((resolve, reject) => {
    const categoriesFromFile = fileSystem.createReadStream(getFilePath(filename))
    CSVParserStream(categoriesFromFile, { headers: true })
      .on('error', (error: Error) => reject(error))
      .on('data', (category: Category) => categories.push(category))
      .on('end', () => resolve(categories))
  })
}

function getTransactions(): Promise<Transaction[]> {
  let transactions: Transaction[] = []
  let filename: string = 'transactions.csv'

  return new Promise((resolve, reject) => {
    const transactionsFile = fileSystem.createReadStream(getFilePath(filename))
    CSVParserStream(transactionsFile, { headers: true })
      .on('error', (error: Error) => reject(error))
      .on('data', (transaction: Transaction) => {
        let amount = parseFloat(transaction.amount.toString())
        let date = new Date(transaction.date)
        let categoryId = transaction.categoryId ? transaction.categoryId : null
        transactions.push({ ...transaction, categoryId, date, amount })
      })
      .on('end', () => {
        transactions = transactions.slice(1, 501) // TODO: only for dev env
        resolve(transactions)
      })
  })

}

async function main() {
  const accounts: Account[] = await getAccounts()
  const categories: Category[] = await getCategories()
  const transactions: Transaction[] = await getTransactions()

  try {
    await prisma.transaction.deleteMany()
    await prisma.category.deleteMany()
    await prisma.account.deleteMany()
    console.log('Tables content deleted with success!')
  } catch (error) {
    console.log('Something went wrong while deleting the content of tables!', error)
  }

  try {
    await prisma.account.createMany({ data: accounts })
    await prisma.category.createMany({ data: categories })
    await prisma.transaction.createMany({ data: transactions })
    console.log('Tables seeded with success!')
  } catch (error) {
    console.log('Something went wrong while seeding with content the tables!', error)
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })