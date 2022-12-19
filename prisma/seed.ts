const fileSystem = require('fs')
const CSVParser = require('csv-parser')

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

function getFilePath(filename: string): string {
  return `./seeds/${filename}`
}

type FileOptions = {
  filename: string,
  fileOptions: {
    skipLines: number,
    headers: string[] | boolean,
  }
}

function readCSVFileStream(fileOptions: FileOptions) {
  let contents = []
  return new Promise((resolve, reject) => {
    fileSystem
      .createReadStream(getFilePath(fileOptions.filename))
      .pipe(CSVParser(fileOptions.fileOptions))
      .on('data', (content) => contents.push(content))
      .on('end', () => { resolve(contents) })
      .on('error', (error: Error) => reject(error))
  })
}

function getAccounts() {
  let options = {
    filename: 'accounts.csv',
    fileOptions: { skipLines: 1, headers: ['id', 'name', 'bank'] }
  }
  return readCSVFileStream(options)
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