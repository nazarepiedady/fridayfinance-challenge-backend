const fileSystem = require('fs')
const CSVParser = require('csv-parser')

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
    fileSystem
      .createReadStream(getFilePath(filename))
      .pipe(CSVParser(fileOptions))
      .on('data', (account: Account) => accounts.push(account))
      .on('end', () => { resolve(accounts) })
      .on('error', (error: Error) => reject(error))
  })
}

function getCategories() {
  let options = {
    filename: 'categories.csv',
    fileOptions: { skipLines: 1, headers: ['id', 'name', 'color'] }
  }
  return readCSVFileStream(options)
}

async function main() {
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })