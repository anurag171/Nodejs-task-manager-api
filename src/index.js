const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/user')
const taskRouter = require('./router/task')
const app = express()
const port = process.env.PORT


const multer = require('multer')
const upload = multer({
    dest:'images',
    limits:{
       fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file){
            cb(new Error('File cannot empty'))
        }
        if(!file.originalname.match(/\.(doc|docx)$/)){
            cb(new Error('File must be word document'))
        }
        cb(undefined,true)
    }
    
})

const errorMiddlewear = (req,res,next)=>{
    throw new Error('This is from error middlewear')
}

app.post('/upload',upload.single('upload'),(req,res)=>{

    res.send()

},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

// app.use((req,res,next)=>{
//     console.log(req.method,req.path)
//     if(req.method=='GET'){
//         res.send('Get request are disabled!!')
//     }else{
//     next()
//     }
// })

//Maintainence mode code
// app.use((req,res,next)=>{
//     res.status(503).send('Site are under maintainence!!')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
    console.log('Server is up and running on '+port)
})

// const jwt = require('jsonwebtoken')

// const myFunction = async ()=>{
//     const token = jwt.sign({_id:'abc123'},'this is my jwt token',{expiresIn:'7 days'})
//     //console.log(token)
//     const data = jwt.verify(token,'this is my jwt token')
//     //console.log(data)
// }

// myFunction()

// const Task = require('./models/task')
// const UserModel = require('./models/user')

// const main = async () =>{
//     // const task = await Task.findById('5f677b23ac6ec952f44420e9')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

//     const user = await UserModel.findById('5f677af6ac6ec952f44420e7')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()