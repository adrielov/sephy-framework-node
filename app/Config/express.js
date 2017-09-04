var body_parser   = require('body-parser');
var error_handler = require('errorhandler');

module.exports = function(app, express) {
	app.use(body_parser.urlencoded({
	  extended: true
	}));
    app.use(error_handler());
};