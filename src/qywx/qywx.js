// const Qiyeweixin = {};
// declare var Meteor;
// declare var ServiceConfiguration;
// declare var HTTP;

// 获取登录信息
let getLoginInfo = function (access_token, auth_code) {
    var data, qyapi, response, _ref, _ref2;
    try {
        qyapi = (_ref = Meteor.settings.qiyeweixin) != null ? (_ref2 = _ref.api) != null ? _ref2.getLoginInfo : void 0 : void 0;
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
let getProviderToken = function (corpid, provider_secret) {
    var data, qyapi, response, _ref, _ref2;
    try {
        qyapi = (_ref = Meteor.settings.qiyeweixin) != null ? (_ref2 = _ref.api) != null ? _ref2.getProviderToken : void 0 : void 0;
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
let getSuiteAccessToken = function (suite_id, suite_secret, suite_ticket) {
    var data, qyapi, response, _ref, _ref2;
    try {
        qyapi = (_ref = Meteor.settings.qiyeweixin) != null ? (_ref2 = _ref.api) != null ? _ref2.getSuiteAccessToken : void 0 : void 0;
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
let getPreAuthCode = function (suite_id, suite_access_token) {
    var data, qyapi, response, _ref, _ref2;
    try {
        qyapi = (_ref = Meteor.settings.qiyeweixin) != null ? (_ref2 = _ref.api) != null ? _ref2.getPreAuthCode : void 0 : void 0;
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
let getPermanentCode = function (suite_id, auth_code, suite_access_token) {
    var data, qyapi, response, _ref, _ref2;
    try {
        qyapi = (_ref = Meteor.settings.qiyeweixin) != null ? (_ref2 = _ref.api) != null ? _ref2.getPermanentCode : void 0 : void 0;
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
let getCorpToken = function (auth_corpid, permanent_code, suite_access_token) {
    var data, qyapi, response, _ref, _ref2;
    try {
        qyapi = (_ref = Meteor.settings.qiyeweixin) != null ? (_ref2 = _ref.api) != null ? _ref2.getCorpToken : void 0 : void 0;
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
let getAdminList = function (auth_corpid, agentid) {
    var data, o, qyapi, response, _ref, _ref2, _ref3;
    try {
        o = ServiceConfiguration.configurations.findOne({
            service: "qiyeweixin"
        });
        qyapi = (_ref = Meteor.settings.qiyeweixin) != null ? (_ref2 = _ref.api) != null ? _ref2.getAdminList : void 0 : void 0;
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

// 获取用户信息
let getUserInfo3rd = function (code) {
    var getUserInfo3rdUrl, o, qyapi, response, _ref, _ref2, _ref3;
    try {
        o = ServiceConfiguration.configurations.findOne({
            service: "qiyeweixin"
        });
        qyapi = (_ref = Meteor.settings.qiyeweixin) != null ? (_ref2 = _ref.api) != null ? _ref2.getUserInfo3rd : void 0 : void 0;
        getUserInfo3rdUrl = qyapi + "?access_token=" + (o != null ? (_ref3 = o.secret) != null ? _ref3.suite_access_token : void 0 : void 0) + "&code=" + code;
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
let getUserList = function (access_token, department_id) {
    var getUserListUrl, qyapi, response, _ref, _ref2;
    try {
        qyapi = (_ref = Meteor.settings.qiyeweixin) != null ? (_ref2 = _ref.api) != null ? _ref2.getUserList : void 0 : void 0;
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
let getAllUserList = function (access_token) {
    var getAllUserListUrl, qyapi, response, _ref, _ref2;
    try {
        qyapi = (_ref = Meteor.settings.qiyeweixin) != null ? (_ref2 = _ref.api) != null ? _ref2.getAllUserList : void 0 : void 0;
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
let getDepartmentList = function (access_token) {
    var getDepartmentListUrl, qyapi, response, _ref, _ref2;
    try {
        qyapi = (_ref = Meteor.settings.qiyeweixin) != null ? (_ref2 = _ref.api) != null ? _ref2.getDepartmentList : void 0 : void 0;
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