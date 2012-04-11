var path         = require( "path" ),
	fs           = require( "fs" ),
	mime         = require( 'mime' ),
	errorHandler = require( './errorHandler' );

function out( response, fileName ){
	var fullFileName = path.join(process.cwd(), fileName );
	// console.log( fullFileName );
	path.exists( fullFileName, function( exists ){
		if( !exists ){
			errorHandler.error404( response );
			return;  
		}

		fs.readFile( fullFileName, "binary", function( error, file ){
			if( error ){
				errorHandler.error500( response, error );
				return;
			}

			response.writeHead( 200, { "Content-Type" : mime.lookup( fullFileName ) } );  
			response.write( file, "binary" );  
			response.end();  
		});
	});
}

exports.out = out;