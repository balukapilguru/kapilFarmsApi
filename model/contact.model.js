const { DataTypes } = require('sequelize')
const sequelize = require('./db.js')

const contactModel = sequelize.define('Contact', {
  name: { type: DataTypes.STRING },
  email: {
    type: DataTypes.STRING,
    validate(value) {
      isEmail(value)
    },
  },
  phonenumber: { type: DataTypes.STRING },
})

module.exports = contactModel
