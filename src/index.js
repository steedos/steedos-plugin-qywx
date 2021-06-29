const express = require('express');
const router = require('./qywx/api').router;
const qywxPush = require('./qywx/notifications');
      
module.exports = {
    init: function () {
        qywxPush.notify();
        let app = express();
        app.use('', router);
        WebApp.connectHandlers.use(app);
    }
}