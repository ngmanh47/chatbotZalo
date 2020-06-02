const user = require('../models/user');
const message = require('../models/message');
const conversation = require ('../models/conversation');
const fetch = require('node-fetch');

const access_token = 'lNkJ5Kes4pgwUfCHJJSHERvxc11EAc91ppYVFJiLTLUAKu4T6abNJeXpgGqOUsnxh46NCbrFTbtRTeegHsPM0_9wjo5VDcjnoZgN1NGHKYY69wHWEovTIiq3k2TE5NfbvmN_FramDsElUjGSE6uCQAvW-ZKR9XzDjnFaCJTL0sAIVFaG0dGiFuizscazAWahgItST0GR6HUh7F1wFpeJ2iumzbbF2ImBo4JiStLzQ3dxJuuNQdnyVSCogp1nO5X-m2kYLNnbOXdqMw5WHdGe6i5HgZHjOrbmD4p4Vx0RIYeNF0';

module.exports = class receiveController {

    constructor(){
        this.mUser = new user();
        this.mConversation = new conversation();
        this.mMessage = new message();
    }

    async receiveMessage(info_data){
        // Neu nguoi gui la user -> them user -> them message -> them conversation
        if(info_data.is_oa == false){
            let user = await this.mUser.getOneByUserSocialId(info_data.sender_id);
            // console.log('----------------------------USER------------------------')
            // console.log(user)
            // Neu user chua ton tai
            if(user == null){
                let newUser = '';
                let api_data = '';
                await fetch(
                    `https://openapi.zalo.me/v2.0/oa/getprofile?access_token=` + access_token + `&data={"user_id":"` + info_data.sender_id + `"}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'GET',
                    }
                ).then(function(data) {
                    console.log(data);
                    return data.json();
                }).then(function(parsed){
                    api_data = parsed;
                });

                let gender = "";
                api_data.data.user_gender == 1 ? gender = "male" : gender = "female";
                newUser = await this.createUser(info_data.sender_id, gender, api_data.data.display_name);

                if(newUser != null){
                    let newConversationData = {
                        // channel_id: channel.channel_id,
                        user_id: newUser.user_id,
                        last_time: info_data.time,
                        last_message: info_data.content,
                        content_type: info_data.type,
                        // is_read: 1
                    };
                    //conversation mới tạo
                    let newConversation = await this.mConversation.createConversation(newConversationData);

                    
                    if(newConversation != null){
                        let newMessageData = {
                            conversation_id: user.conversation.conversation_id,
                            // receiver_id: channel.channel_id,
                            sender_id: user.user_id,
                            // content: striptags(info_data.content),
                            content_type: info_data.type,
                            time: info_data.time,
                            type: 'receive'
                        };
                        //message mới tạo
                        let newMessage = await this.mMessage.createMessage(newMessageData);
                        let returnMessage = await this.mMessage.getMessageById(newMessage.mess_id);

                        return returnMessage;
                    }
                }
            }
            // neu user da ton tai
            else{
                let newMessageData = {
                    conversation_id: user.conversation.conversation_id,
                    // receiver_id: channel.channel_id,
                    sender_id: user.user_id,
                    content: info_data.content,
                    content_type: info_data.type,
                    time: info_data.time,
                    type: 'receive'
                };
                //message mới tạo
                let newMessage = await this.mMessage.createMessage(newMessageData);

                //cập nhật last message, last time của conversation
                if(newMessage != null){
                    let conversation = await this.mConversation.getOneConversationById(newMessage.conversation_id);
                    let updateConversationData = {
                        last_time: info_data.time,
                        last_message: newMessage.content,
                        content_type: info_data.type,
                        is_read: conversation.is_read + 1
                    };
                    await this.mConversation.updateConversation(conversation.conversation_id, updateConversationData);
                    let returnMessage = await this.mMessage.getMessageById(newMessage.mess_id);

                    return returnMessage;
                }
            }

        }
        // Neu nguoi gui la oa ->  them message -> update last message
        else{
            console.log('ahihiaihaihasihaihiahiahiahiahai');
        }


    }

    async createUser(user_social_id, gender, name){
        let newUserData = {
            user_social_id: user_social_id,
            name: name,
            gender: gender
        };
        //user mới tạo
        let newUser = await new user().createUser(newUserData);
        return newUser;
    };
}