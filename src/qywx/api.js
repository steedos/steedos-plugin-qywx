let newCrypt, _ref, _ref2, _ref3, _ref4;
const Cookies = require("cookies");
let express = require('express');
let router = express.Router();
let parser = require('xml2json');
let qiyeweixin = require('./qywx');
let _sync = require('./sync');
let WXBizMsgCrypt = require('wechat-crypto');
let objectql = require('@steedos/objectql');
const steedosConfig = objectql.getSteedosConfig();
let config = ServiceConfiguration.configurations.findOne({
    service: "qiyeweixin"
});
ServiceConfiguration.configurations.update(config._id, {
    $set: {
        "suite_id": "wwdf2bbe3817d8a40a",
        "suite_secret": "sfPGwVbVzht-_dLvf85gzHua2YGp0HVD3NkeSsDafKw"
    },
    $currentDate: {
        "modified": true
    }
});
if (config) {
    newCrypt = new WXBizMsgCrypt(config != null ? (_ref = config.secret) != null ? _ref.token : void 0 : void 0, config != null ? (_ref2 = config.secret) != null ? _ref2.encodingAESKey : void 0 : void 0, config != null ? (_ref3 = config.secret) != null ? _ref3.corpid : void 0 : void 0);
}
let TICKET_EXPIRES_IN = (config != null ? (_ref4 = config.secret) != null ? _ref4.ticket_expires_in : void 0 : void 0) || 1000 * 60 * 20;



// 
router.use("/qywx", async function (req, res, next) {
    console.log("qywxqywxqywxqywx");
    await next();
});

// 工作台首页
router.get("/api/qiyeweixin/mainpage", async function (req, res, next) {
    let appid, authorize_uri, o, redirect_uri, url, _ref5, _ref6, _ref7;
    o = ServiceConfiguration.configurations.findOne({
        service: "qiyeweixin"
    });
    if (o) {
        redirect_uri = encodeURIComponent(Meteor.absoluteUrl('api/qiyeweixin/auth_login'));
        authorize_uri = typeof steedosConfig !== "undefined" && steedosConfig !== null ? (_ref5 = steedosConfig.qywx) != null ? _ref5.authorize_uri : void 0 : void 0;
        appid = o != null ? (_ref7 = o.secret) != null ? _ref7.corpid : void 0 : void 0;
        url = authorize_uri + '?appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_base#wechat_redirect';
        res.writeHead(302, {
            'Location': url
        });
        return res.end('');
    }
});

// 网页授权登录
router.get("/api/qiyeweixin/auth_login", async function (req, res, next) {
    let authToken, cookies, hashedToken, user, userId, userInfo, _ref5;
    cookies = new Cookies(req, res);
    userId = cookies.get("X-User-Id");
    authToken = cookies.get("X-Auth-Token");
    console.log("userId: ",userId);
    console.log("authToken: ",authToken);
    console.log("req.query.code: ",req.query.code);
    if (req != null ? (_ref5 = req.query) != null ? _ref5.code : void 0 : void 0) {
        userInfo = qiyeweixin.getUserInfo3rd(req.query.code);
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write('<head><meta charset="utf-8"/></head>');
        res.write('<h1>提示 Tips</h1>');
        res.write('<h2>未从企业微信获取到网页授权码</h2>');
        return res.end('');
    }
    user = Creator.getCollection("users").findOne({
        'services.qiyeweixin.id': userInfo != null ? userInfo.UserId : void 0
    });
    if (!user) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write('<head><meta charset="utf-8"/></head>');
        res.write('<h1>提示 Tips</h1>');
        res.write('<h2>正在同步企业微信用户数据...</h2>');
        return res.end('');
    }
    if (userId && authToken) {
        if (user._id !== userId) {
            qiyeweixin.clearAuthCookies(req, res);
            hashedToken = Accounts._hashLoginToken(authToken);
            Accounts.destroyToken(userId, hashedToken);
        } else {
            res.writeHead(302, {
                'Location': '/'
            });
            return res.end('');
        }
    }
    authToken = Accounts._generateStampedLoginToken();
    hashedToken = Accounts._hashStampedToken(authToken);
    Accounts._insertHashedLoginToken(user._id, hashedToken);
    qiyeweixin.setAuthCookies(req, res, user._id, authToken.token);
    res.writeHead(302, {
        'Location': '/'
    });
    return res.end('');
});

// 从企业微信端单点登录:从浏览器后台管理页面"前往服务商后台"进入的网址
router.get("/api/qiyeweixin/sso_steedos", async function (req, res, next) {
    let at, authToken, hashedToken, loginInfo, o, user, _ref5, _ref6, _ref7;
    o = ServiceConfiguration.configurations.findOne({
        service: "qiyeweixin"
    });
    at = qiyeweixin.getProviderToken(o != null ? (_ref5 = o.secret) != null ? _ref5.corpid : void 0 : void 0, o != null ? (_ref6 = o.secret) != null ? _ref6.provider_secret : void 0 : void 0);
    if (at && at.provider_access_token) {
        loginInfo = qiyeweixin.getLoginInfo(at.provider_access_token, req.query.auth_code);
        if (loginInfo != null ? (_ref7 = loginInfo.user_info) != null ? _ref7.userid : void 0 : void 0) {
            console.log("loginInfo.user_info.userid: ",loginInfo.user_info.userid);
            user = db.users.findOne({
                'services.qiyeweixin.id': loginInfo.user_info.userid
            });
            if (user) {
                authToken = Accounts._generateStampedLoginToken();
                hashedToken = Accounts._hashStampedToken(authToken);
                Accounts._insertHashedLoginToken(user._id, hashedToken);
                qiyeweixin.setAuthCookies(req, res, user._id, authToken.token);
                res.writeHead(302, {
                    'Location': '/'
                });
                return res.end('success');
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.write('<head><meta charset="utf-8"/></head>');
                res.write('<h1>提示 Tips</h1>');
                res.write('<h2>正在同步企业微信用户数据...</h2>');
                return res.end('');
            }
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write('<head><meta charset="utf-8"/></head>');
            res.write('<h1>提示 Tips</h1>');
            res.write('<h2>未从企业微信获取到用户信息！</h2>');
            return res.end('');
        }
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write('<head><meta charset="utf-8"/></head>');
        res.write('<h1>提示 Tips</h1>');
        res.write('<h2>未从企业微信获取到服务商的Token</h2>');
        return res.end('');
    }
});

// 创建套件使用，验证第三方回调协议可用性
router.get("/api/qiyeweixin/callback", async function (req, res, next) {
    let result = newCrypt.decrypt(req.query.echostr);
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });
    return res.end(result.message);
});

// 第三方回调协议
router.post("/api/qiyeweixin/callback", async function (req, res, next) {
    let msg_signature, nonce, postData, timestamp;
    postData = '';
    msg_signature = req.query.msg_signature;
    timestamp = req.query.timestamp;
    nonce = req.query.nonce;
    req.setEncoding('utf8');
    req.on("data", function (postDataChunk) {
        return postData += postDataChunk;
    });
    return req.on('end', Meteor.bindEnvironment(function () {
        let json, jsonPostData, message, result, _ref5;
        jsonPostData = {};
        jsonPostData = parser.toJson(postData);
        jsonPostData = JSON.parse(jsonPostData);
        result = newCrypt.decrypt(jsonPostData.xml.Encrypt);
        json = parser.toJson(result.message);
        json = JSON.parse(json);
        message = json.xml || {};
        switch (message != null ? message.InfoType : void 0) {
            case 'suite_ticket':
                SuiteTicket(message);
                console.log("suite_ticket-----");
                res.writeHead(200, {
                    "Content-Type": "text/plain"
                });
                return res.end("success");
            case 'create_auth':
                console.log("create_auth-----");
                res.writeHead(200, {
                    "Content-Type": "text/plain"
                });
                res.end("success");
                return CreateAuth(message);
            case 'cancel_auth':
                console.log("cancel_auth-----");
                res.writeHead(200, {
                    "Content-Type": "text/plain"
                });
                res.end(result != null ? result.message : void 0);
                return CancelAuth(message);
            case 'change_auth':
                console.log("change_auth-----");
                return ChangeContact(message.AuthCorpId);
            case 'change_contact':
                console.log("change_contact-----");
                return ChangeContact(message.AuthCorpId);
            case 'enter_agent':
                console.log("enter_agent-----");
                res.writeHead(200, {
                    "Content-Type": "text/plain"
                });
                res.end("success");
                return res.end(result != null ? result.message : void 0);
        }
    }));
});

// 通讯录变更，更新space表=============
let ChangeContact = function (corp_id) {
    let s_qywx, space;
    space = Creator.getCollection("spaces").findOne({
        'services.qiyeweixin.corp_id': corp_id
    });
    if (space) {
        s_qywx = space.services.qiyeweixin;
        s_qywx.remote_modified = new Date;
        s_qywx.need_sync = true;
        return Creator.getCollection("spaces").direct.update({
            _id: space._id
        }, {
            $set: {
                'services.qiyeweixin': s_qywx
            }
        });
    }
};

// 取消授权，更新space表=============OK
let CancelAuth = function (message) {
    let corp_id, s_qywx, space;
    corp_id = message.AuthCorpId;
    space = Creator.getCollection("spaces").findOne({
        'services.qiyeweixin.corp_id': corp_id
    });
    if (space) {
        s_qywx = space.services.qiyeweixin;
        s_qywx.permanent_code = void 0;
        s_qywx.need_sync = false;
        return Creator.getCollection("spaces").direct.update({
            _id: space._id
        }, {
            $set: {
                is_deleted: true,
                'services.qiyeweixin': s_qywx
            }
        });
    }
};

// 根据推送过来的临时授权码，获取永久授权码
let CreateAuth = function (message) {
    let auth_corp_info, auth_info, auth_user_info, o, permanent_code, r, service, _ref5;
    o = ServiceConfiguration.configurations.findOne({
        service: "qiyeweixin"
    });
    if (o) {
        r = qiyeweixin.getPermanentCode(message != null ? message.SuiteId : void 0, message != null ? message.AuthCode : void 0, o != null ? (_ref5 = o.secret) != null ? _ref5.suite_access_token : void 0 : void 0);
        if (r && (r != null ? r.permanent_code : void 0)) {
            permanent_code = r.permanent_code;
            auth_corp_info = r.auth_corp_info;
            auth_info = r.auth_info;
            auth_user_info = r.auth_user_info;
            service = {};
            service.corp_id = auth_corp_info.corpid;
            service.permanent_code = permanent_code;
            service.auth_user_id = auth_user_info.userid;
            service.agentid = auth_info.agent[0].agentid;
            return initSpace(service, auth_corp_info.corp_name);
        }
    }
};

let initSpace = function (service, name) {
    let doc, modified, newSpace, space;
    space = Creator.getCollection("spaces").findOne({
        "services.qiyeweixin.corp_id": service.corp_id
    });
    if (space) {
        service.remote_modified = new Date;
        service.need_sync = true;
        modified = new Date;
        newSpace = Creator.getCollection("spaces").direct.update({
            _id: space._id
        }, {
            $set: {
                modified: modified,
                name: name,
                is_deleted: false,
                'services.qiyeweixin': service
            }
        });
    } else {
        doc = {};
        doc._id = 'qywx-' + service.corp_id;
        doc.name = name;
        doc.is_deleted = false;
        doc.created = new Date;
        service.need_sync = true;
        service.remote_modified = new Date;
        doc.services = {
            qiyeweixin: service
        };
        newSpace = Creator.getCollection("spaces").direct.insert(doc);
    }
    newSpace = Creator.getCollection("spaces").findOne({
        "services.qiyeweixin.corp_id": service.corp_id
    });
    if (newSpace) {
        return _sync.syncCompany(newSpace);
    }
};

// 根据suite_ticket，获取suite_access_token
let SuiteTicket = function (message) {
    let o, r, _ref5, _ref6;
    o = ServiceConfiguration.configurations.findOne({
        service: "qiyeweixin"
    });
    if (o) {
        r = qiyeweixin.getSuiteAccessToken(o.suite_id, o.suite_secret, message.SuiteTicket);
        if (r && (r != null ? r.suite_access_token : void 0)) {
            return ServiceConfiguration.configurations.update(o._id, {
                $set: {
                    "suite_ticket": message.SuiteTicket,
                    "suite_access_token": r.suite_access_token
                },
                $currentDate: {
                    "modified": true
                }
            });
        }
    }
};


exports.router = router;