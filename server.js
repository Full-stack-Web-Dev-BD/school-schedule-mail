const express=require('express')
const app=express()
const PORT=process.env.PORT||5000
const mongoos=require('mongoose')
const bodyParser=require('body-parser')
const cors =require('cors')
const multer=require('multer')
const mailer=require('./mailer')

const userRouter=require('./router/userRouter')
const scheduleRouter =require('./router/scheduleRouter')


const storage = multer.diskStorage({
    destination:function(req, file , cb){
        cb(null , './uploads/')
    }, 
    filename:function(req, file , cb){
        cb(null ,  Date.now().toString()+file.originalname  )
    }
})

const upload =multer({storage:storage})




app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(userRouter)
app.use(scheduleRouter)




app.post('/send-email' ,upload.single('file'), (req, res)=>{
    // console.log(req.body.to)
    // console.log(req.file)
    // console.log(req.body.to.split(','))
    mailer(
        req.body.from,
        req.body.to.split(','),
        req.body.subject,
        req.body.massage,
        req.file.filename,
        res
    )
})
app.listen(PORT, (req, res)=>{
    console.log('Server started on port ', PORT)
    mongoos.connect('mongodb://localhost/mo-app',{useFindAndModify:false,useUnifiedTopology:true,useNewUrlParser:true},(err=>{
        if(err){
            console.log(err)
            return
        }
        console.log('Mongodb  connected')
    }))
})