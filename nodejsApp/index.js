const path = require('path')
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req,res)=>{
    res.sendFile(path.resolve(__dirname, 'index.html'));
})

app.listen(port, () => {
  console.log(`Server is working on ${port} port.`)
})