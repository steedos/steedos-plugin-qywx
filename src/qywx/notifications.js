let Qiyeweixin = require("./qywx")
let objectql = require('@steedos/objectql');
const steedosConfig = objectql.getSteedosConfig();

Meteor.startup(function(){
    Push.oldSend = Push.send;
    Push.send = function(options){
        Push.oldSend(options);
        try {
            let ref;
            if (options.from !== 'workflow')
                return;
            
            if (!options.payload)
                return;
            
            let space = Creator.getCollection('spaces').findOne({_id: options.payload.space});
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
            let instanceId = options.payload.instance;
            let instance = Creator.getCollection('instances').findOne({_id:instanceId});
            
            let instanceUrl = steedosConfig.qywx.workflow_url + 'workflow/space/' + spaceId + '/inbox/' + instanceId;
            
            let text = "请审批 " + '<a href=' + instanceUrl + '>' + options.text + '</a>';
            if(instance.state == "completed")
                text = options.text
            
            console.log("text--------: ",text);
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

            Qiyeweixin.sendMessage(msg,service.access_token);
            console.log("-----options------",options);
        } catch (error) {
            console.error("Push error reason: ",error);
        }
    }
})