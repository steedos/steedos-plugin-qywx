let Qiyeweixin = require("./qywx")
// 网页授权url
let oauthUrl = Meteor.absoluteUrl('/api/qiyeweixin/mainpage?target=');

Meteor.startup(function(){
    Push.oldSend = Push.send;
    Push.send = function(options){
        Push.oldSend(options);
        try {
            // console.log("options:---",options);
            if (options.from !== 'workflow')
                return;
            
            if (!options.payload)
                return;
            
            let space = Creator.getCollection('spaces').findOne({_id: options.payload.space});
            
            if (!space)
                return;
            
            if (!space.services.qiyeweixin)
                return;
            
            let space_user = Creator.getCollection('space_users').findOne({space:space._id, user:options.query.userId});
            if (!space_user.qywx_id)
                return;
            
            console.log("Push.send");
            let qywx_userId = space_user.qywx_id;
            let service = space.services.qiyeweixin;
            let agentId = service.agentid;
            let spaceId = space._id;
            let payload = options.payload;
            let url = "";
            let text = "";
            let title = "";
            
            // 审批流程
            if (payload.instance){
                title = "审批王";
                text = workflowPush(options,spaceId).text;
                url = workflowPush(options,spaceId).url;
            }else{
                title = "华炎魔方";
                url = oauthUrl + payload.url;
            }
            
            if (payload.related_to){
                text = options.title + '  ' + options.text;
            }
            
            let o = ServiceConfiguration.configurations.findOne({
                service: "qiyeweixin"
            });
            at = Qiyeweixin.getCorpToken(service.corp_id, service.permanent_code, o.suite_access_token);
            if (at && at.access_token) {
                service.access_token = at.access_token;
            }

            let msg = {
                "touser" : qywx_userId,
                "msgtype" : "textcard",
                "agentid" : agentId,
                "textcard" : {
                    "title" : title,
                    "description" : text,
                    "url" : url,
                    "btntxt": "详情"
                },
                "safe":0,
                "enable_id_trans": 0,
                "enable_duplicate_check": 0,
                "duplicate_check_interval": 1
            }
            // 发送推送消息
            Qiyeweixin.sendMessage(msg,service.access_token);
        } catch (error) {
            console.error("Push error reason: ",error);
        }
    }
})

// 待审核推送
let workflowPush = function(options,spaceId){
    if (!options || (options == {}))
        return false;
    
    let info = {};
    info.text = "";
    info.url = "";
    // 获取申请单
    let instanceId = options.payload.instance;
    let instance = Creator.getCollection('instances').findOne({_id:instanceId});
    
    let inboxUrl =  oauthUrl + '/workflow/space/' + spaceId + '/inbox/' + options.payload.instance;

    let outboxUrl = oauthUrl + '/workflow/space/' + spaceId + '/outbox/' + options.payload.instance;
    
    info.text = '请审批 ' + options.title + ' ' + options.text;
    info.url = inboxUrl
    
    if (!instance){
        info.text = options.text;
    }else{
        if (instance.state == "completed"){
            info.text = options.text;
            info.url = outboxUrl;
        }
    }
    return info;
}