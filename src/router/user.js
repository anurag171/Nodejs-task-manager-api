const express = require('express')
const auth =require('../middleware/auth')
const router = new express.Router()
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail,sendFarewellEmail}=require('../emails/accountnotification')

router.post('/users',async (req,res)=>{
    const user = new User(req.body)

    try{        
        const token = await user.generateAuthToken()
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        res.status(201).send({user,token})
    }catch(e){
        console.log(e)
        res.status(400).send(e) 
    }
})

router.post('/users/login',async (req,res)=>{
    
    try{
        const user = await User.findbyCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()               
        res.status(200).send({user,token})
    }catch(e){        
        res.status(400).send(e) 
    }
})

router.post('/users/logout',auth,async (req,res)=>{
    
    try{
       // console.log('token received ' + req.token)
      // console.log('tokens set ' + req.user.tokens )
        req.user.tokens = req.user.tokens.filter((token)=>{
            //console.log('in action token: %s ==! %s',token.token ,req.token)
            return token.token !== req.token
        })
        //console.log('filetered token: %s',req.user.tokens)
        await req.user.save()
        res.send({message:'logout successful'})

    }catch(e){ 
        console.log(e)       
        res.status(500).send(e) 
    }
})

router.post('/users/logoutAll',auth,async (req,res)=>{
    
    try{
        req.user.tokens = []
        await req.user.save()
        res.send({message:'All session logout successful'})

    }catch(e){ 
        console.log(e)       
        res.status(500).send(e) 
    }
})

router.get('/getusers/me',auth,async (req,res)=>{

    try{         
       res.send(req.user)
    }catch(e){
        res.status(500).send(e)   
    }    
})

router.get('/getusers/:id',async (req,res)=>{
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send(e)
        }
        res.send(user)

    }catch(e){
        res.status(500).send(e)       
    }    
})

router.patch('/users/me',auth, async (req,res)=>{
    const updates =Object.keys(req.body)
    const allowedUpdates = ['name','age','income','email','password']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
    if(!isValidOperation){
       return res.status(400).send({error:'Invalid Updates!'})  
    }
    try{
        const user = req.user
        updates.forEach((update)=> user[update]=req.body[update])
        await user.save()        
        res.status(201).send(user)  
    }catch(e){
        console.log(e)
        res.status(500).send(e)   
    }
})

router.delete('/users/me',auth,async (req,res)=>{
    try{
        await req.user.remove()
        sendFarewellEmail(user.email,user.name)        
        res.status(201).send(req.user)  
    }catch(e){
        console.log(e)
        res.status(400).send(e)   
    }
})

router.get('/email/:email',async (req,res)=>{
    const _email = req.params.email
    try{
        const user =  User.findOne({email:_email})
        if(!user){
            return res.status(404).send()
        }
        res.send(user)

    }catch(e){
        res.status(500).send(e)     
    }    
})

const upload = multer({    
    limits:{
        fileSize:1000000
     },
     fileFilter(req,file,cb){
         if(!file.originalname.match(/\.(jpg|jpeg|png|PNG|JPEG|JPG)$/)){
             cb(new Error('File must be jpg,jpeg or png document'))
         }
         cb(undefined,true)
     }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:150,height:150}).png().toBuffer()
    req.user.avatar=req.file.buffer
    await req.user.save()
    res.status(200).send({message:'Avatar Uploaded!'})

},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.status(200).send({message:'Avatar Deleted!'})

}) 

router.get('/users/:id/avatar',async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }       
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send(e)  
    }

}) 
module.exports=router