//* importing
const express=require('express');
const mongoose=require('mongoose');
const connection='mongodb://tanay:Ceww3aFqYEcSmhM@cluster0-shard-00-00.peysn.mongodb.net:27017,cluster0-shard-00-01.peysn.mongodb.net:27017,cluster0-shard-00-02.peysn.mongodb.net:27017/learndb?ssl=true&replicaSet=atlas-vdbv79-shard-0&authSource=admin&retryWrites=true&w=majority';
const Posts =require('./post.js');

//* app config
const app=express();
const PORT= process.env.PORT || 9000;


//* DB config
mongoose.connect(connection, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
},()=>{
    console.log('connected');
});

//* api routes
app.get('/',(req,res)=>res.status(200).send('the server is up and running'))
app.use(express.json());

//* listener
app.listen(PORT,()=>console.log(`listening on port ${PORT}`));


//*can insert document
app.post('/post',(req,res)=>{
    const dbmsg= req.body;
    Posts.create(dbmsg , (err , data)=>{
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(201).send(
                `new msg created \n ${data}`
            );
        }

    })

});


//*can get all the documents
app.post('/find',(req,res)=>{
    Posts.find({},(err,data)=>{
        if(err){
           res.send(err);
        }
        else{
            res.send(data);
        }
    })
});


//*can find specific document
app.post('/findSpecific',(req,res)=>{
    Posts.find({name:req.body.name},(err,data)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(data);
        }
    })
})

//*can limit 
app.post('/limit',(req,res)=>{
    Posts.find({}).limit(1).exec((err,post)=>{
        console.log(post);
    })
})


//*can sort
app.post('/sort',(req,res)=>{
    Posts.find({}).sort({"name":1}).exec((err,data)=>{
        res.send(data);
    })
})


//*can count documents in collection
app.post('/count',(req,res)=>{
    Posts.countDocuments((err,count)=>{
        res.send(`count is ${count}`);
    })
});


//*forEach in mongoose
app.post('/forEach',(req,res)=>{
    Posts.find({},(err,data)=> {
        if(err){
            res.send(err);
        }
        else{
            data.forEach((dat)=>{
                console.log(`name is ${dat.name}`)
            });
        }
    });
});


//*updating data
app.post('/update',(req,res)=>{
    Posts.findOneAndUpdate({name:req.body.name},{
        $set:{
            title:req.body.title,
        }
    },
    {
        upsert:true
    },()=>{
        Posts.find({name:req.body.name},(err,data)=>{
            if (err){
                res.send(err);
            }
            else{
                res.send(data);
            }
        })
    })
})

//*updating(incrementing) likes
app.post('/incre',(req,res)=>{
    Posts.findOneAndUpdate({name:req.body.name},{
        $inc:{
            likes:1,
        }
    },
    {
        upsert:true
    },()=>{
        Posts.find({name:req.body.name},(err,data)=>{
            if (err){
                res.send(err);
            }
            else{
                res.send(data);
            }
        })
    })
});


//*rename operator

app.post('/rename',(req,res)=>{
    Posts.findOneAndUpdate({name:req.body.name},{
        $rename:{
            likes:'views',
        }
    },
    {
        upsert:true
    },()=>{
        Posts.find({name:req.body.name},(err,data)=>{
            if (err){
                res.send(err);
            }
            else{
                res.send(data);
            }
        })
    })
});

//*search
app.post('/search',(req,res)=>{
    Posts.find({
        $text:{
            $search:"\"this is wow\"",
        }
    },(err,data)=>{
        res.send(data);
    })
});

