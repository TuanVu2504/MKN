import dotenv from 'dotenv'
dotenv.config({ path: '/project/.env' })

export default {
  dbhost: process.env.dbhost,
  dbuser: process.env.dbuser,
  dbport: process.env.dbport as unknown as number,
  dbpassword: process.env.dbpassword,
  dbdatabase: process.env.dbdatabase,
  apiport: process.env.API_PORT,
  auth_token_name: process.env.auth_token_name,
  jwt_key: process.env.jwt_key
}