/**
* Module dependencies
*/
var express = require('express');
require('express-group-routes');
var orm     = require('orm');
var _path    = require('path');

/**
* Load Model, Controller core
*/
var helper     = require('./helper/_helper');
var model      = require('./model/model');
var controller = require('./controller/controller');


let sephyServer = {
    run : serverRun,
    opt : {}
}

module.exports = function(opts) {
    if(arguments.length === 1) {
        sephyServer.opt = opts
    }
    return sephyServer;
};

function serverRun(callback,errorCallback){
    var opt = sephyServer.opt;

    var app, setting, mode, path, server , globalError;

    express = opt.express   || express;
    orm     = opt.orm       || orm;
    path    = helper.remoteDirname() + '/app';
    root_path    = helper.remoteDirname();
    mode    = opt.mode      || process.env.NODE_ENV || 'production';
    
    app = express();

    var http = require('http').createServer(app);  
    var io = require('socket.io')(http);

    /**
    * Load config files
    */
    console.log("2 - Load config files \n");
    var hook_routes  = require(root_path + '/app/routes');
    var settings     = require(path + '/Config/settings');
    var hook_express = require(path + '/Config/express');
    var hook_orm     = require(path + '/Config/orm');

    /**
    * Load and set all setting
    */
    console.log("3 - Load setting \n");
    if(!settings[mode]) {
        globalError = "Invalid Setting";
        return errorCallback("Invalid Setting");
    }

    setting = settings[mode];
    app.use(function(req, res, next) {
        req.settings = setting;
        req.mode     = mode;
        req.io       = io;
        return next();
    });

    /**
    * ORM Config
    */
    model(app, {
        setting: setting,
        hook: hook_orm,
        path: path + '/Models',
        orm: orm,
        mode: mode
    }, function(err, database) {
        if(err) {
            globalError = "Fail to load models";
            return errorCallback("Fail to load models",err.message);
        }

        /**
        * Express config hook
        */
        hook_express(app, express, {
            mode: mode,
            settings: setting
        });

        /**
        * Load all helpers in folders
        */
        var helpers = {};
        helper.listJSFiles(path + '/Helpers', function(err, files) {
            if(err) {
                globalError = "Fail to load utils";
                return errorCallback("Fail to load utils",err.message);
            }

            for(var i = 0; i < files.length; i++) {
                var help = _path.basename(files[i], '.js');
                helpers[help] = require(files[i]);
            }

            app.use(function(req, res, next) {
                req.helper = helpers;
                return next();
            });
        });

        /**
        * CALL ROUTES
        */
        controller(path + '/Controllers', function(err, controllers) {
            if(err) {
                globalError = "Fail to load controllers";
                return errorCallback("Fail to load controllers",err.message);
            }

            /**
            * Load all middlewares in folders
            */
            var middlewares = {};
            helper.listJSFiles(path + '/Middlewares', function(err, files) {
                if(err) {
                    globalError = "Fail to load middlewares";
                    return errorCallback("Fail to load middlewares",err.message);
                }

                helper.mapAsync(files,function(file, index, arr, next){
                    var middleware = _path.basename(file, '.js');
                    middlewares[middleware] = require(file);
                    next();
                },function(){
                    hook_routes(app, controllers, middlewares, {
                        mode: mode,
                        settings: setting
                    });
                })
            });
        });

        setTimeout(function(argument) {
            /**
            * Create http server
            */
            if(globalError == undefined){
                console.log("4 - Sephy running in "+mode+" \n")
                server = http.listen(setting.port, function(){
                    callback({
                        server:     server,
                        orm:        orm,
                        database:   database,
                        express:    express,
                        app:        app,
                        settings:    setting,
                        mode:       mode,
                        io:       io,
                    });
                });
            }
        },1000)
    });
}