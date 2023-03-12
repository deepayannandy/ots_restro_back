require("dotenv").config()

const https= require("https");
var cors = require('cors');
const fs= require("fs");
const path= require("path");
const express= require("express");
const app= express();
const mongoos=require("mongoose");
const aws =require('aws-sdk');
const { crypto, randomBytes } =require('crypto');

const region=process.env.region;
const bucketName=process.env.bucketName;
const accessKeyId=process.env.accessKeyId;
const secretAccessKey=process.env.secretAccessKey;

const s3= new  aws.S3 ({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion:'v4',
})

mongoos.connect(process.env.DATABASE_URL)
const db= mongoos.connection
db.on('error',(error)=> console.error(error))
db.once('open',()=> console.log('Connected to Database!'))


app.use(express.json())
app.use(cors());

const userRouter= require("./routes/user_auth")
const restroRouter= require("./routes/restros")
const menuRouter= require("./routes/menuitems")
const ordersRouter= require("./routes/orders")
const barfineRouter= require("./routes/barfine")
const tokenRouter= require("./routes/token");
const inventory = require("./routes/inventory");

app.use("/api/user",userRouter)
app.use("/api/restro",restroRouter)
app.use("/api/menu",menuRouter)
app.use("/api/orders",ordersRouter)
app.use("/api/barfine",barfineRouter)
app.use("/api/token",tokenRouter)
app.use("/api/inventory",inventory)

const sslServer=https.createServer(
    {
        key:fs.readFileSync(path.join(__dirname, 'cert','key.pem')),
        cert:fs.readFileSync(path.join(__dirname, 'cert','cert.pem')),
    },app
)

sslServer.listen(3443,()=> console.log("https Server is listning!"))

app.get('/s3url/:name',async (req,res)=>{
    console.log(req.params.name)
    const imagename=req.params.name
    
    const params=({
        Bucket:bucketName,
        Key:imagename,
        Expires:60,
    })
    const uploadUrl=await s3.getSignedUrlPromise('putObject',params)
    res.send({uploadUrl})
})
app.listen(6622,()=>{
    console.log("Http Server is listning!")
})