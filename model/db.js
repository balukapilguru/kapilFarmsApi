const { config } = require('dotenv')
config()
const Sequelize = require('sequelize')

const sequelize = new Sequelize('kapilfarmsdb', 'admin', 'rootadmin', {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false, // Uncomment if you want to disable logging
})

;(async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
  } catch (e) {
    console.error(`[Server]: Error at ${e}`)
  }
})()

module.exports = sequelize
