const {MongoClient,ObjectID} = require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'

const databaseName = 'task-manager'

const id = new ObjectID()
console.log(id.id)
console.log(id.id.length)

MongoClient.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log('Unable to connect to database')        
    }
       const db= client.db(databaseName)

       db.collection('task-users').deleteMany({age:35}).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })

       db.collection('userdetails').updateMany({completed:false},
       {
           $set:{
            completed:true
           }
        }).then((result)=>{
            console.log(result)
        }).catch((error)=>{
            console.log(error)
        })

     /* const upddatePromise =  db.collection('task-users').updateOne({_id: new ObjectID('5f5e54912360446f30a1a079')},
       {
           $set:{
                name:"Pattu",
                age:35
           }
        })

        upddatePromise.then((result)=>{
            console.log(result)
        }).catch((error)=>{
            console.log(error)
        })*/


       /*db.collection('userdetails').findOne({name:'Anurag'},(error,result)=>{
        if(error){
            return console.log('Unable to insert task-users')
        }
        console.log(result)
       })*/
     /*  db.collection('userdetails').insertMany([{
           name:'Arunesh',
           details:'Employee'
       },{
        name:'Arunima',
        details:'Housewife'
    },{
        name:'Anurag',
        details:'Enterprenuer'
    }],(error,result)=>{
           if(error){
               return console.log('Unable to insert task-users')
           }
           console.log(result.ops)

       })   */
})

