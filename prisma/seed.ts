const fileSystem = require('fs')
//const CSVParser = require('csv-parser')
import { parseStream as CSVParserStream } from 'fast-csv'

import { PrismaClient, Account, Category, Transaction } from '@prisma/client'
const prisma = new PrismaClient()

function getFilePath(filename: string): string {
  return `./seeds/${filename}`
}

type FileOptions = {
  skipLines: number,
  headers: string[] | boolean,
}

function getAccounts(): Promise<Account[]> {
  let accounts: Account[] = []
  let filename: string = 'accounts.csv'
  let fileOptions: FileOptions = { skipLines: 1, headers: ['id', 'name', 'bank'] }

  return new Promise((resolve, reject) => {
    const accountsFile = fileSystem.createReadStream(getFilePath(filename))
    CSVParserStream(accountsFile)
      .on('error', (error: Error) => reject(error))
      .on('data', (account: Account) => { accounts.push(account) })
      .on('end', (accountCount: number) =>
        console.log(`Parsed ${accountCount} rows`))
    /* fileSystem
      .createReadStream(getFilePath(filename))
      .pipe(CSVParser(fileOptions))
      .on('error', (error: Error) => reject(error))
      .on('data', (account: Account) => accounts.push(account))
      .on('end', () => { resolve(accounts) }) */
  })
}

function getCategories(): Promise<Category[]> {
  let categories: Category[] = []
  let filename: string = 'categories.csv'
  let fileOptions: FileOptions = { skipLines: 1, headers: ['id', 'name', 'color'] }

  return new Promise((resolve, reject) => {
    fileSystem
      .createReadStream(getFilePath(filename))
      //.pipe(CSVParser(fileOptions))
      .on('error', (error: Error) => reject(error))
      .on('data', (category: Category) => categories.push(category))
      .on('end', () => { resolve(categories) })
  })

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
    /* const accounts = await getAccounts() */
    /* const categories = await getCategories() */
    const transactions = await getTransactions()
    console.log(transactions)

    /* await prisma.account.deleteMany()
    await prisma.account.createMany({ data: accounts }) */

    /* await prisma.category.deleteMany()
    await prisma.category.createMany({ data: categories }) */

    //await prisma.transaction.deleteMany()
    //await prisma.transaction.createMany({ data: transactions })
  }

  main()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })