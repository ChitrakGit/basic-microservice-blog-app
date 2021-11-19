const express = require('express');
const {randomBytes} = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const { default: axios } = require('axios');
const app = express();
app.use(bodyParser.json())
app.use(cors());

// const comments = []
const commentsByPostId = {} ;

const clusterIp = `http://events-srv:4005`;
const localIp = `http://localhost:4005`

app.get('/posts/:id/comments',(req,res)=>{
    return res.status(201).send(commentsByPostId[req.params.id] || [] );
})

app.post('/posts/:id/comments',async (req,res)=>{
    let id = randomBytes(4).toString('hex');
    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] || [] ;
    comments.push({id:id,content,status:'pending'});

    commentsByPostId[req.params.id] = comments;

    await axios.post(`${clusterIp}/events`,{
        type:"CommentCreated",
        data:{
            id:id,
            content:content,
            postId:req.params.id,
            status:'pending'
        }
    })
    
    return res.status(201).send(commentsByPostId[req.params.id]);
})

app.delete('/posts/:id/comments/:cid',(req,res)=>{
    return res.send("hi");
})

app.post('/events',async(req,res) =>{
    console.log('eventReceived',req.body.type);
    let { type , data } = req.body;

    if(type == "CommentModerated"){
        let {id, content, postId , status } = data;
        let comments = commentsByPostId[postId];
        let comment = comments.find(comment => {
            return comment.id == id;
        })
        comment.status = status;
        console.log("status ",status)
        await axios.post(`${clusterIp}/events`,{
            type:"CommentUpdated",
            data:{
                id:id,
                content:content,
                postId:postId,
                status:status
            }
        })
    }
    return res.send({status:200});
})

app.listen(4001,()=>{
    console.log("running in 4001")
})