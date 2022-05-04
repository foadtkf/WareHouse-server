const express=require('express')
const app=express()
const port =process.env.PORT||5000


app.get('/',(req,res)=>{
res.send('Running my Node CRUD Server')
})
app.listen(port, ()=>{
console.log('CRUD server is running')
})