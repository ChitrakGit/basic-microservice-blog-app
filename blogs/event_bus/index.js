const express = require('express');
const {randomBytes} = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const { default: axios } = require('axios');
const app = express();
app.use(bodyParser.json())
app.use(cors());

const events = [];

const clusterIp_posts = `http://posts-srv:4000`;
const localIp_posts = `http://localhost:4000`;

const clusterIp_comments = `http://comments-srv:4001`;
const localIp_comments = `http://localhost:4001`;

const clusterIp_query = `http://query-srv:4002`;
const localIp_query = `http://localhost:4002`;

const clusterIp_moderators = `http://moderators-srv:4003`;
const localIp_moderators = `http://localhost:4003`;

app.post('/events',async (req,res)=>{
    const event = req.body;
    events.push(event);
    await axios.post(`${clusterIp_posts}/events`,event);
    await axios.post(`${clusterIp_comments}/events`,event);
    await axios.post(`${clusterIp_query}/events`,event);
    await axios.post(`${clusterIp_moderators}/events`,event);
    
    
    return res.send({status:"ok"});
})

app.get('/events',async(req,res)=>{
    res.send(events)
})

app.listen(4005,()=>{
    console.log("running in 4005")
})