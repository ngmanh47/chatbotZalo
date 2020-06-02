const model = require('./allModels');

module.exports = class user extends model{
    constructor(){
        super();
        this.mUser = this.modelUser();
        this.mConversation = this.modelConversation();

        this.mUser.hasOne(this.mConversation, {foreignKey: 'user_id'});
    }
    createUser(data){
        return this.mUser.create(data);
    }
    getOneByUserSocialId(social_id){
        return this.mUser.findOne({
            where: {user_social_id: social_id},
            include: [{
                model: this.mConversation
            }]
        });
    }
    getListUser() {
        return this.mUser.findAll();
   }
}