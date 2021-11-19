const express = require('express');
const {randomBytes} = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');

const { default: axios } = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const posts = {};

const clusterIp = `http://events-srv:4005`;
const localIp = `http://localhost:4005`
app.get('/posts', (req,res)=>{
    return res.status(201).send(posts);
})

app.post('/posts/create',async (req,res)=>{
    let id = randomBytes(4).toString('hex');
    const { title} = req.body;
    posts[id] = {id,title};
    
    await axios.post(`${clusterIp}/events`,{
        type:'PostCreated',
        data:{id,title}
    })
    return res.status(201).send(posts[id]);
})

app.delete('/posts',(req,res)=>{
    return res.send("hi")
})

app.post('/events',(req,res) =>{
    console.log('eventReceived',req.body.type);
    return res.send({status:200});
})

app.listen(4000,()=>{
    console.log("ver 0.0.10")
    console.log("running in 4000")
})