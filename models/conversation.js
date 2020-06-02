const model = require('./allModels');

module.exports = class conversation extends model{
    constructor(){
        super();
        this.mConversation = this.modelConversation();
        this.mUser = this.modelUser();

        this.mConversation.belongsTo(this.mUser, {foreignKey: 'user_id'});
    }
    createConversation(data){
        return this.mConversation.create(data);
    }
    getListConversation(){
        return this.mConversation.findAll({
            order: [
                ['last_time', 'DESC']
            ],
        });
    }
    getOneConversationById(id){
        return this.mConversation.findOne({
            where: {conversation_id: id},
            include: [
                {
                    model: this.mUser
                }
            ],
        });
    }

    async updateConversation(id, data){
        let conversation = await this.mConversation.findOne({ where: {conversation_id: id} });
 
        return conversation.update(data);
    }
}