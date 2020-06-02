const user = require('../models/user');
const conversation = require('../models/conversation');
const message = require('../models/message');

module.exports = class requestController {

    constructor(){
        this.mUser = new user();
        this.mConversation = new conversation();
        this.mMessage = new message();
    }
    readConversation(conversation_id){
        return this.mConversation.updateConversation(conversation_id, {is_read: 0});
    }
}