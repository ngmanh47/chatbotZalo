
const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const server = require("http").Server(app);
var io = require("socket.io").listen(server);

const zalo = require('./API-Integration/zalo');
const receiveController = require('./controllers/receiveController');
const requestController = require('./controllers/requestController');


let cRequest = new requestController();

app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

//zalo verification

const app_id = '4232044300322373924';
const app_secret = 'KUhl9p64xG67JFI5n85I';
const callbackUrl = 'https://656453c249b5.ngrok.io/webhook';
const OAsecretKey = 'ASPcGqo0Wr5qsxJ5f7Hq';
const access_token = 'lNkJ5Kes4pgwUfCHJJSHERvxc11EAc91ppYVFJiLTLUAKu4T6abNJeXpgGqOUsnxh46NCbrFTbtRTeegHsPM0_9wjo5VDcjnoZgN1NGHKYY69wHWEovTIiq3k2TE5NfbvmN_FramDsElUjGSE6uCQAvW-ZKR9XzDjnFaCJTL0sAIVFaG0dGiFuizscazAWahgItST0GR6HUh7F1wFpeJ2iumzbbF2ImBo4JiStLzQ3dxJuuNQdnyVSCogp1nO5X-m2kYLNnbOXdqMw5WHdGe6i5HgZHjOrbmD4p4Vx0RIYeNF0';



// io.on('connection', function(socket){
//     console.log('Client connected.');
//     // Send message
//     socket.on('send-message', async function (data) {
//         sendMessage(data);
//     });
// });
io.on('connection', (socket) => {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', (data) => {
      console.log(data);
    });
});

async function sendMessage(data){

}

app.post('/webhook', function(req, res){

    // check file attachments -> chua xu ly -> mac dinh la text

    console.log('-----------------');
    console.log(req.body);
    console.log('-----------------');

    if(req.body.app_id){
        const event = req.body;
        let today = new Date(parseInt(event.timestamp));
        let type = '';
        let content = '';
        // check sender is OA or USER
        let name_sender = event.event_name;
        console.log(name_sender);
        if(name_sender == "user_send_text"){
            is_oa = false;
            console.log('La User');
        }
        else {
            is_oa = true;
            console.log('La admin');
        }
        
        // check content
        if(typeof event.message.text !== 'undefined'){
            content = event.message.text;
            type = 'text';
        }
        else{
            // attachments: (image, gif, ...)
            console.log('attachment');
        }
        let info_data = {
            receiver_id: event.recipient.id,
            sender_id: event.sender.id,
            content: content,
            type: type,
            time: today,
            is_oa: is_oa
        };
        console.log('--------------------------------info_data--------------------------------');
        console.log(info_data);
        console.log('--------------------------------info_data--------------------------------');
        //io.sockets.emit('receive-message', info_data);
        let rec = new receiveController();
        return rec.receiveMessage(info_data);
    }
    res.sendStatus(200);
});

app.get('/webhook', function(req, res){
    
    // get infor user from request query when user send message
    // let url_getInfor = 'https://openapi.zalo.me/v2.0/oa/getprofile?access_token='+ access_token +'&data={"user_id":"0961050499"}';
   
    var user_id = req.query.fromuid;
    var mess_id_receive = req.query.msgid;
    var message = req.query.message;
    var timestamp = req.query.timestamp;
    console.log(req.query);

    // save message of user into database
    let mes = {
        mess_id: mess_id_receive,    
        user_id: user_id,    
        admin_id: 1,   
        message: message,
        sender: 1,       
        created_at: timestamp
    }
    // messageModel.add(mes);

    zalo.sendText(access_token, user_id, 'Nguyen Ngoc Manh chao ban');
    // save message of admin into database

    // res.render('index');
    res.sendStatus(200);
})


const PORT = 3000;
// server.listen( PORT , function(){
//     console.log(`Server running at http://localhost:${PORT}`);
// })

server.listen(process.env.PORT || 3000 ,function(){
    console.log(`Server running at http://localhost:${PORT}`);
});