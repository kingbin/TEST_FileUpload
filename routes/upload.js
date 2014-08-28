/*
 * POST upload page
 */

var util			= require('util')
	, formidable	= require('formidable')
	, fs			= require('fs-extra');

exports.file = function(logger){ 
	
	return function(req, res, next){
	
		var form = new formidable.IncomingForm();
	    form.uploadDir = "./img";       //set upload directory
	    form.keepExtensions = true;     //keep file extension
	
	    form.parse(req, function(err, fields, files) {
	        res.writeHead(200, {'content-type': 'text/plain'});
	        var fileData = util.format('RECEIVED FILE\n\tFile: %s \n\tSize:%s\n\tType: %s\n'
	        		, JSON.stringify(files.fileUploaded.path)
	        		, JSON.stringify(files.fileUploaded.size)
	        		, JSON.stringify(files.fileUploaded.type));
	        
	        res.write(fileData);
	        
	        //DEBUGGING
	        logger.info(fileData);
	
	        fs.rename(files.fileUploaded.path, './img/'+files.fileUploaded.name, function(err) {
		        if (err)
		            throw err;
		        logger.info( 'renaming complete' );
	        });
	         
	        res.end();
	    });
	}
};