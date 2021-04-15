let objectql = require('@steedos/objectql');
const steedosConfig = objectql.getSteedosConfig();
const Cookies = require("cookies");
let Hashes = require("jshashes");
let qywx_api = require('./router.js');
let SHA1 = new Hashes.SHA1;

// 获取登录信息
exports.getLoginInfo = function (access_token, auth_code) {
    console.log('getLoginInfo access_token: ',access_token);
    var data, qyapi, response, _ref, _ref2;
    try {
        qyapi = qywx_api.getLoginInfo;
        if (!qyapi)
            return;
        
        data = {
            auth_code: auth_code
        };
        response = HTTP.post(qyapi + "?access_token=" + access_token, {
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.statusCode !== 200) {
            throw response;
        }
        return response.data;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with getLoginInfo. " + err), {
            response: err
        });
    }
};

// 获取服务商的token
exports.getProviderToken = function (corpid, provider_secret) {
    var data, qyapi, response, _ref, _ref2;
    try {
        qyapi = qywx_api.getProviderToken;
        if (!qyapi)
            return;
        
        data = {
            corpid: corpid,
            provider_secret: provider_secret
        };
        response = HTTP.post(qyapi, {
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.statusCode !== 200) {
            throw response;
        }
        return response.data;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with getProviderToken. " + err), {
            response: err
        });
    }
};

// 获取suite_access_token:OK
exports.getSuiteAccessToken = function (suite_id, suite_secret, suite_ticket) {
    var data, qyapi, response, _ref, _ref2;
    try {
        qyapi = qywx_api.getSuiteAccessToken;
        if (!qyapi)
            return;
        
        data = {
            suite_id: suite_id,
            suite_secret: suite_secret,
            suite_ticket: suite_ticket
        };
        response = HTTP.post(qyapi, {
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.statusCode !== 200) {
            throw response;
        }
        return response.data;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with getSuiteAccessToken. " + err), {
            response: err
        });
    }
};

// 获取预授权码:OK
exports.getPreAuthCode = function (suite_id, suite_access_token) {
    var data, qyapi, response, _ref, _ref2;
    try {
        qyapi = qywx_api.getPreAuthCode;
        if (!qyapi)
            return;
        
        data = {
            suite_id: suite_id
        };
        response = HTTP.post(qyapi + "?suite_access_token=" + suite_access_token, {
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.statusCode !== 200) {
            throw response;
        }
        return response.data;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with getPreAuthCode. " + err), {
            response: err
        });
    }
};

// 获取企业永久授权码
exports.getPermanentCode = function (suite_id, auth_code, suite_access_token) {
    var data, qyapi, response, _ref, _ref2;
    try {
        qyapi = qywx_api.getPermanentCode;
        if (!qyapi)
            return;
        
        data = {
            suite_id: suite_id,
            auth_code: auth_code
        };
        response = HTTP.post(qyapi + "?suite_access_token=" + suite_access_token, {
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.statusCode !== 200) {
            throw response;
        }
        return response.data;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with getPermanentCode. " + err), {
            response: err
        });
    }
};

// 获取CorpToken
exports.getCorpToken = function (auth_corpid, permanent_code, suite_access_token) {
    var data, qyapi, response, _ref, _ref2;
    try {
        qyapi = qywx_api.getCorpToken;
        if (!qyapi)
            return;
        
        data = {
            auth_corpid: auth_corpid,
            permanent_code: permanent_code
        };
        response = HTTP.post(qyapi + "?suite_access_token=" + suite_access_token, {
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.statusCode !== 200) {
            throw response;
        }
        return response.data;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with getCorpToken. " + err), {
            response: err
        });
    }
};

// 获取管理员列表
exports.getAdminList = function (auth_corpid, agentid) {
    var data, o, qyapi, response, _ref, _ref2, _ref3;
    try {
        o = ServiceConfiguration.configurations.findOne({
            service: "qiyeweixin"
        });
        qyapi = qywx_api.getAdminList;
        if (!qyapi)
            return;
        
        data = {
            auth_corpid: auth_corpid,
            agentid: agentid
        };
        response = HTTP.post(qyapi + "?suite_access_token=" + (o != null ? (_ref3 = o.secret) != null ? _ref3.suite_access_token : void 0 : void 0), {
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.statusCode !== 200) {
            throw response;
        }
        return response.data.admin;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with getAdminList. " + err), {
            response: err
        });
    }
};

// 获取第三方用户信息
exports.getUserInfo3rd = function (code) {
    var getUserInfo3rdUrl, o, qyapi, response, _ref, _ref2, _ref3;
    try {
        o = ServiceConfiguration.configurations.findOne({
            service: "qiyeweixin"
        });
        qyapi = qywx_api.getUserInfo3rd;
        if (!qyapi)
            return;
        
        getUserInfo3rdUrl = qyapi + "?access_token=" + o.suite_access_token + "&code=" + code;
        // console.log("getUserInfo3rdUrl: ",getUserInfo3rdUrl);
        response = HTTP.get(getUserInfo3rdUrl);
        if (response.error_code) {
            throw response.msg;
        }
        if (response.data.errcode > 0) {
            throw response.data.errmsg;
        }
        return response.data;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with getUserInfo3rdUrl. " + err), {
            response: err
        });
    }
};

// 获取部门下用户列表
exports.getUserList = function (access_token, department_id) {
    var getUserListUrl, qyapi, response, _ref, _ref2;
    try {
        qyapi = qywx_api.getUserList;
        if (!qyapi)
            return;
        
        getUserListUrl = qyapi + "?access_token=" + access_token + "&department_id=" + department_id + "&fetch_child=0";
        response = HTTP.get(getUserListUrl);
        if (response.error_code) {
            console.error(response.error_code);
            throw response.msg;
        }
        if (response.data.errcode > 0) {
            throw response.data.errmsg;
        }
        return response.data.userlist;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with getUserList. " + err), {
            response: err
        });
    }
};

// 获取当前公司所有用户列表
exports.getAllUserList = function (access_token) {
    var getAllUserListUrl, qyapi, response, _ref, _ref2;
    try {
        qyapi = qywx_api.getAllUserList;
        if (!qyapi)
            return;
        
        getAllUserListUrl = qyapi + "?access_token=" + access_token + "&department_id=1&fetch_child=1";
        response = HTTP.get(getAllUserListUrl);
        if (response.error_code) {
            console.error(response.error_code);
            throw response.msg;
        }
        if (response.data.errcode > 0) {
            throw response.data.errmsg;
        }
        return response.data.userlist;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with getAllUserListUrl. " + err), {
            response: err
        });
    }
};

// 获取部门列表（全量）
exports.getDepartmentList = function (access_token) {
    console.log("access_token: ",access_token);
    var getDepartmentListUrl, qyapi, response, _ref, _ref2;
    try {
        qyapi = qywx_api.getDepartmentList;
        if (!qyapi)
            return;
        
        getDepartmentListUrl = qyapi + "?access_token=" + access_token;
        response = HTTP.get(getDepartmentListUrl);
        if (response.error_code) {
            console.error(response.error_code);
            throw response.msg;
        }
        if (response.data.errcode > 0) {
            throw response.data.errmsg;
        }
        return response.data.department;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with getDepartmentList. " + err), {
            response: err
        });
    }
};

// 获取签名
exports.getSignature = function(jsapiticket, noncestr, timestamp, url){
    let string1 = 'jsapi_ticket=' + jsapiticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url;
    let sign = SHA1.hex(string1);
    return sign;
};

// 设置cookies
exports.setAuthCookies = function(req, res, userId, authToken) {
    var cookies;
    cookies = new Cookies(req, res);
    cookies.set("X-User-Id", userId, {
        maxAge: 90 * 60 * 60 * 24 * 1000,
        httpOnly: false,
        overwrite: true
    });
    return cookies.set("X-Auth-Token", authToken, {
        maxAge: 90 * 60 * 60 * 24 * 1000,
        httpOnly: false,
        overwrite: true
    });
};

// 清理cookies
exports.clearAuthCookies = function(req, res) {
    var cookies, uri;
    cookies = new Cookies(req, res);
    cookies.set("X-User-Id");
    cookies.set("X-Auth-Token");
    if (req.headers.origin) {
        uri = new URI(req.headers.origin);
    } else if (req.headers.referer) {
        uri = new URI(req.headers.referer);
    }
    cookies.set("X-User-Id", "", {
        domain: uri != null ? uri.domain() : void 0,
        overwrite: true
    });
    return cookies.set("X-Auth-Token", "", {
        domain: uri != null ? uri.domain() : void 0,
        overwrite: true
    });
};

// 发送消息
exports.sendMessage = function(data,access_token){
    try {
        let url = qywx_api.sendMessage;
        if (!url)
            return;
        
        let response = HTTP.post(url + "?access_token=" + access_token, {
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.statusCode !== 200) {
            throw response;
        }
        return response.data;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to send message with error: " + err), {
            response: err
        });
    }
}

// 企业内部获取access_token
exports.getToken = function(corpid,secret){
    try {
        let url = qywx_api.getToken;
        if (!url)
            return;
        
        let response = HTTP.get(url + "?corpid=" + corpid + "&corpsecret=" + secret);
        if (response.error_code) {
            console.error(response.error_code);
            throw response.msg;
        }
        if (response.data.errcode > 0) {
            throw response.data.errmsg;
        }
        return response.data.access_token;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to get token with error: " + err), {
            response: err
        });
    }
}

// 企业内部获取工作区
exports.getSpace = function(){
    try {
        let space;
        let spaceId = typeof steedosConfig !== "undefined" && steedosConfig !== null ? (_ref5 = steedosConfig.tenant) != null ? _ref5._id : void 0 : void 0;
        if (!spaceId){
            space = Creator.getCollection('spaces').findOne({});
        }else{
            space = Creator.getCollection('spaces').findOne({_id:spaceId});
        }

        return space;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to get space with error: " + err), {
            response: err
        });
    }
}

// 获取企业内部用户信息
exports.getUserInfo = function (access_token, code) {
    var getUserInfoUrl, qyapi, response, _ref, _ref2, _ref3;
    try {
        qyapi = qywx_api.getUserInfo;
        if (!qyapi)
            return;
        
        getUserInfoUrl = qyapi + "?access_token=" + access_token + "&code=" + code;
        // console.log("getUserInfoUrl: ",getUserInfoUrl);
        response = HTTP.get(getUserInfoUrl);
        if (response.error_code) {
            throw response.msg;
        }
        if (response.data.errcode > 0) {
            throw response.data.errmsg;
        }
        return response.data;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with getUserInfoUrl. " + err), {
            response: err
        });
    }
};

// 待审核推送
exports.workflowPush = function (options, spaceId, oauthUrl) {
    if (!options || (options == {}))
        return false;

    let info = {};
    info.text = "";
    info.url = "";
    info.title = "审批王";
    // 获取申请单
    let instanceId = options.payload.instance;
    let instance = Creator.getCollection('instances').findOne({ _id: instanceId });

    let inboxUrl = oauthUrl + '/workflow/space/' + spaceId + '/inbox/' + options.payload.instance;

    let outboxUrl = oauthUrl + '/workflow/space/' + spaceId + '/outbox/' + options.payload.instance;

    info.text = '请审批 ' + options.text;
    info.url = inboxUrl;
    info.title = options.title;

    if (!instance) {
        info.text = options.text;
    } else {
        if (instance.state == "completed") {
            info.text = options.text;
            info.url = outboxUrl;
        }
    }
    return info;
};