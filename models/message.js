const model = require('./allModels');

module.exports = class message extends model{
    constructor(){
        super();
        this.mMessage = this.modelMessage();
        this.mUser = this.modelUser();
        this.mConversation = this.modelConversation();

        this.mMessage.belongsTo(this.mUser, {foreignKey: 'sender_id'});
        this.mMessage.belongsTo(this.mConversation, {foreignKey: 'conversation_id'});
    }
    createMessage(data){
        return this.mMessage.create(data);
    }

    getMessageById(mess_id){
        return this.mMessage.findOne({
            where: {
                mess_id: mess_id
            },
            include: [
                {
                    model: this.mUser
                },
                {
                    model: this.mConversation
                }
            ]
        });
    }

    async updateMessage(id, data){
        let mes = await this.mMessage.findOne({ where: {message_id: id} });

        return this.mMessage.update(data);
    }
}