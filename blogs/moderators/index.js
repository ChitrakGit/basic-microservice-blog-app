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

app.post('/events', async(req,res)=>{
    let {type, data} = req.body;
    console.log("in moda type",type)
    if(type == 'CommentCreated'){
        let status = data.content.includes('asd') ? 'rejected' : 'approved';

        await axios.post(`${clusterIp}/events`,{
            type:"CommentModerated",
            data:{
                id:data.id,
                postId:data.postId,
                content:data.content,
                status:status
            }
        })
        
    }
    return res.status(201).send(posts);
})





// app.post('/events',(req,res) =>{
//     console.log('eventReceived',req.body.type);
//     return res.send({status:200});
// })

app.listen(4003,()=>{
    console.log("running in 4003")
})