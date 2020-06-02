const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

module.exports = class allModels {
    constructor(){
        this.Op = Sequelize.Op; //operator
    }

    modelUser(){
        class modelUser extends Sequelize.Model {}
        modelUser.init({
            user_id: {type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true},
            user_social_id: {type: Sequelize.STRING},
            email: {type: Sequelize.STRING},
            name: {type: Sequelize.STRING},
            gender: {type: Sequelize.TINYINT, defaultValue: 0},
            phone: {type: Sequelize.STRING},
            status: {type: Sequelize.INTEGER, defaultValue: 0},
            created_at: {type: Sequelize.DATE},
            updated_at: {type: Sequelize.DATE},
        },
        {
            sequelize, modelName: 'user',
            tableName: 'user',
            timestamps: false
        });
        return modelUser
    }

    modelAdmin(){
        class modelAdmin extends Sequelize.Model {}
        modelAdmin.init({
            admin_id: {type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true},
            email: {type: Sequelize.STRING},
            status: {type: Sequelize.INTEGER, defaultValue: 0},
            created_at: {type: Sequelize.DATE},
            updated_at: {type: Sequelize.DATE},
        },
        {
            sequelize, modelName: 'admin',
            tableName: 'admin',
            timestamps: false
        })
        return modelAdmin
    }

    modelMessage(){
        class modelMessage extends Sequelize.Model {}
        modelMessage.init({
            mess_id: {type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true},
            conversation_id: {type: Sequelize.INTEGER},
            sender_id: {type: Sequelize.INTEGER},
            receiver_id: {type: Sequelize.INTEGER},
            content: {type: Sequelize.TEXT},
            is_bot: {type: Sequelize.TINYINT, defaultValue: 0},
            type: {type: Sequelize.ENUM('receive', 'send')},
            created_at: {type: Sequelize.DATE},
            updated_at: {type: Sequelize.DATE},
        },
        {
            sequelize, modelName: 'message',
            tableName: 'message',
            timestamps: false
        })
        return modelMessage
    }

    modelConversation(){
        class modelConversation extends Sequelize.Model {}
        modelConversation.init({
            conversation_id: {type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true},
            user_id: {type: Sequelize.INTEGER},
            last_time: {type: Sequelize.DATE},
            last_message: {type: Sequelize.TEXT},
            content_type: {type: Sequelize.ENUM('text', 'image', 'audio', 'file')},
            // is_read: {type: Sequelize.INTEGER},
            // is_survey: {type: Sequelize.ENUM(0,1)},
            // option_status: {type: Sequelize.INTEGER, defaultValue: 0},
            created_at: {type: Sequelize.DATE},
            updated_at: {type: Sequelize.DATE},
        },
        {   
            sequelize, modelName: 'conversation',
            tableName: 'conversation',
            timestamps: false
        });
        return modelConversation;
    }
    
}