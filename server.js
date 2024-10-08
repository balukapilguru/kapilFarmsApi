const express = require('express')
const dotenv = require('dotenv')
const nodemailer = require('nodemailer')
const cors = require('cors')
const morgan=require("morgan")
const contactModel = require('./model/contact.model.js')
// Load environment variables from .env file
dotenv.config()

const app = express()
const port = process.env.PORT || 3030
app.use(cors())
app.use(morgan("combined"))
// Middleware to parse JSON request bodies
// app.use(bodyParser.json());
app.use(express.json())
// Create a connection to the MySQL database
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   keepAliveInitialDelay: 10000,
//   enableKeepAlive: true,
// })

// Connect to the database
// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err)
//     return
//   }
//   console.log('Connected to the MySQL database.')
// })

// Create a Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: process.env.EMAIL_SERVICE,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

const transporter = nodemailer.createTransport({
  pool: true,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  tls: {
    servername: 'smtp.gmail.com',
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Define a route to insert form data into the database and send email
app.post('/contactform', async (req, res) => {
  const { name, email, phonenumber } = req.body

  if (!name || !email || !phonenumber) {
    return res
      .status(400)
      .json({ error: 'Please provide name, email, and phonenumber.' })
  }

  await contactModel.create({ name, email, phonenumber })

  const mailOptions = {
    from: email,
    to: 'dm@kapilfarms.in',
    // to: 'balakrishna.n@teksacademy.com',
    subject: 'New Contact Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nPhone Number: ${phonenumber}`,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error)
      return res.status(500).json({ error: 'Error sending email.' })
    }
    console.log('Email sent: ' + info.response)
    res.status(201).json({ message: 'Data added and email sent successfully!' })
  })
})

app.use((err, req, res, next) => {
  return res.status(500).json(err)
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
