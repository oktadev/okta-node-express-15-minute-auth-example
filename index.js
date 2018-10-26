const express = require('express')
const path = require('path')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static('public'))

// @TODO add auth middleware
// @TODO add registration page
// @TODO add logout route

app.use('/', require('./routes/index'))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`App listening on port ${port}`))
