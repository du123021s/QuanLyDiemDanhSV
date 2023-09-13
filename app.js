const express = require('express')
const app = express()
const port = 3000

app.get('/home', (req, res) => res.send("Welcome to you!"))

app.get('/news', (req, res)=> res.send("News"))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})