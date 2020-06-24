require('dotenv-flow').config();

var server = require('@steedos/meteor-bundle-runner');
var steedos = require('@steedos/core');
var express = require('express');
var app = express();

server.Fiber(function () {
    try {
        server.Profile.run("Server startup", function () {
            server.loadServerBundles();
            WebApp.connectHandlers.use(app);
            const router = require('./src/qywx/api');
            steedos.init();
            server.callStartupHooks();
            server.runMain();
            app.use('', router.router);
        })
    } catch (error) {
       console.error(error.stack)
    }
}).run()
