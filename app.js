
/**
 * Module dependencies.
 */

var express	= require('express')
  	, routes 		= require('./routes')
  	, upload		= require('./routes/upload')
  	, http 			= require('http')
  	, path 			= require('path')

/**
 * middleware variables
 */
var favicon 			= require('serve-favicon')
	, morgan 			= require('morgan')
	, bodyParser		= require('body-parser')
	, methodOverride 	= require('method-override')
	, errorHandler 		= require('errorhandler')
	, router 			= express.Router();


var winston	= require('winston'),
	logger 	= new (winston.Logger)({
			    transports: [
			      new (winston.transports.Console)(),
			      new (winston.transports.File)({ filename: path.join(__dirname,'Logs','info.log') })
			    ]
				, exceptionHandlers: [
	                new winston.transports.File({ filename: path.join(__dirname,'Logs','exceptions.log') })
	              ]
				, exitOnError: false
			  });


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser({defer: true}));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

router.use(function(req, res, next) {
	logger.info(req.method, req.url);
	// continue doing what we were doing and go to the route
	next();	
});

router.get('/', routes.index);
router.post('/upload', upload.file(logger) );

//apply the routes to our application
app.use('/', router);



http.createServer(app).listen(app.get('port'), function(){
	logger.info( 'Service listening on port ' + app.get('port') );
});
