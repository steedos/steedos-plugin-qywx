let Qiyeweixin = require("./qywx")
// 网页授权url
let oauthUrl = Meteor.absoluteUrl('/api/qiyeweixin/mainpage?target=');

Meteor.startup(function(){
    Push.oldSend = Push.send;
    Push.send = function(options){
        Push.oldSend(options);
        try {
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
            
            // 审批流程
            if (payload.instance){
                text = workflowPush(options,spaceId);
            }else{
                url = oauthUrl + payload.url;
            }
            
            if (payload.related_to){
                text = '【华炎魔方】\n' + options.title + '  <a href=\"' + url + '\">' + options.text + '</a>';
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
                "msgtype" : "text",
                "agentid" : agentId,
                "text" : {
                    "content" : text
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
    
    // 获取申请单
    let instanceId = options.payload.instance;
    let instance = Creator.getCollection('instances').findOne({_id:instanceId});
    
    let inboxUrl =  oauthUrl + '/workflow/space/' + spaceId + '/inbox/' + options.payload.instance;

    let outboxUrl = oauthUrl + '/workflow/space/' + spaceId + '/outbox/' + options.payload.instance;
    
    let text = '【审批王】\n请审批 ' + options.title + '  <a href=\"' + inboxUrl + '\">' + options.text + '</a>';
    
    if (!instance){
        return text = '【审批王】\n' + options.text;
    }else{
        if (instance.state == "completed")
            text = '【审批王】\n<a href=\"' + outboxUrl + '\">' + options.text + '</a>';
        
        return text;
    }
}