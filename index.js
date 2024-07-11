const express = require ("express")
const cors = require ('cors')
const app = express ()
const port = process.env.PORT || 9000 ;

// MIDDLEWARE

app.use(cors())
app.use(express.json())



// start mongodb

























app.get('/',(req,res)=>{
    res.send('FRIENDS COMPUTER SHOP ')
});

app.listen(port,()=>{
    console.log(`FRIENDS COMPUTER SHOP RUNNING : ${port}`);
})