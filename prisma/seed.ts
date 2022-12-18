import { readFileSync } from 'fs'

type Account = {
  id: string,
  name: string,
  bank: string,
}

function getAccounts(): Account[] {
  let filePath = '../seeds/accounts.json'
  let accounts = readFileSync(filePath, { encoding: 'utf-8', flag: 'r' })
  return JSON.parse(accounts)
}


type Category = {
  id: string,
  name: string,
  color: string
}

function getCategories(): Category[] {
  let filePath = '../seeds/categories.json'
  let categories = readFileSync(filePath, { encoding: 'utf-8', flag: 'r' })
  return JSON.parse(categories)
}