var path     = require('path');
var callsite = require('callsite');
var fs       = require('fs');

Array.prototype.mapAsync = function (callback, end) {
    var self = this;

    function task(index) {
        var x = self[index];
        if (index >= self.length) {
            end();
        } else {
            callback(self[index], index, self, function () {
                task(index + 1);
            });
        }
    }

    task(0);
};

exports.mapAsync = function(list,callback,done) {
    list.mapAsync(callback,done);
};

/*
 *List all js file
 */
exports.listJSFiles = function(dir, callback) {
    fs.readdir(dir, function (err, files) {
        if (err) return callback(err);

        var js_files = [];

        files.mapAsync(function (file, index, arr, next) {
        var file_path = path.join(dir, file);
            if(fs.statSync(file_path).isFile() && path.extname(file_path) === '.js'){
                js_files.push(file_path);
            }
            next();
        },function(){
            callback(null, js_files);
        });
    });
};

/**
 * Get the caller path dir then append file name
 */
exports.remoteDirname = function(file_name) {
    file_name = file_name || '';
        
    var stack = callsite();
    
    var requester = stack[2].getFileName();

    return path.join(path.dirname(requester), file_name);
};