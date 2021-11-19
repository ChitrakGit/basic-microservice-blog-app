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

const eventHandler = (type,data) =>{
    if(type =="PostCreated"){
        let {id,title} = data;
        posts[id] = {id,title,comments:[]};
    }

    if(type == "CommentCreated"){
        let { id, content,postId, status} = data;
        let post = posts[postId] ;
        post.comments.push({id,content,status}) ;
        
    }

    if(type == 'CommentUpdated'){
        let { id, content,postId, status} = data;
        let post = posts[postId] ;
        let comment = post.comments.find(comment=>{
            return comment.id == id;
        })

        comment.status = status;
    }
}

app.get('/posts', (req,res)=>{
    return res.status(201).send(posts);
})



app.post('/events',(req,res)=>{
    let { type , data } = req.body;

    eventHandler(type,data)

    return res.send({status:400})
})

// app.post('/events',(req,res) =>{
//     console.log('eventReceived',req.body.type);
//     return res.send({status:200});
// })

app.listen(4002,async ()=>{
    console.log("running in 4002");
    const res = await axios.get(`${clusterIp}/events`);
    console.log(res.data)
    for(let event of res.data){
        console.log('processing events', event.type);

        eventHandler(event.type,event.data);
    }
    
})