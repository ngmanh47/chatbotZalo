const fetch = require('node-fetch');

function sendText(channel_access_token, receiver_id, content){
    fetch(
        `https://openapi.zalo.me/v2.0/oa/message?access_token=` + channel_access_token,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                recipient: {
                    user_id: receiver_id,
                },
                message: {
                    text: content
                }
            }),
        }
    ).then(function(data) { //log lỗi nếu có
        return data.json();
    }).then(function(parsed){
        console.log(parsed);
    });

};

function sendMessageTemplate(channel_access_token, receiver_id){
    fetch(
        `https://openapi.zalo.me/v2.0/oa/message?access_token=` + channel_access_token,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                recipient:{
                    user_id: receiver_id
                },
                message: {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "list",
                            text: "Bạn muốn tư vấn sản phẩm hay hỏi về vấn đề khác?",
                            elements: [
                                {
                                    title: "Hệ thống hỗ trợ",
                                    subtitle: "Bạn muốn tư vấn sản phẩm hay hỏi về vấn đề khác?",
                                    image_url: "http://4.bp.blogspot.com/-1pqJ7SAqLf0/VoEkaX2gzcI/AAAAAAAAALc/WLmFQDQt1L4/s1600/zalo%2Bchat.jpg",
                                    // default_action: {
                                    //     type: "oa.open.url",
                                    //     url: "https://developers.zalo.me/"
                                    // }
                                },
                                {
                                    title: "Tư vấn sản phẩm",
                                    subtitle: "Tư vấn sản phẩm",
                                    image_url: "https://medias3.prestastore.com/835054-pbig/chat-bot-for-social-networking.jpg",
                                    type:"oa.query.hide",
                                    payload:"NestleOnBot"
                                },
                                {
                                    title: "Vấn đề khác",
                                    subtitle: "Vấn đề khác",
                                    image_url: "https://media.istockphoto.com/vectors/question-icon-question-mark-vector-id1005214200",
                                    type:"oa.query.hide",
                                    payload:"NestleOnBot"
                                }
                            ]
                        }
                    }
                }
            }),
        }
    ).then(function(data) { //log lỗi nếu có
        return data.json();
    }).then(function(parsed){
        console.log(parsed);
    });
};

module.exports = {sendText, sendMessageTemplate};