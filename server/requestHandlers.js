var querystring  = require( 'querystring' ),
	path         = require( "path" ),
	fs           = require( "fs" ),
	errorHandler = require( './errorHandler' ),
	staticFile   = require( './staticFile' );

function dft( response, pathName, postData ){
	// console.log( "Request handler dft on " + pathName + " was called.");
	staticFile.out( response, pathName );
}

function index( response, postData ){
	// console.log( "Request handler 'index' was called." );
	staticFile.out( response, 'index.html' );
}

function _save( saveLocation, fileName, response, postData, postDataJSON ){
	path.exists( saveLocation, function( exists ){
		if( !exists ){
			fs.mkdir( saveLocation );
		}

		var stream = fs.createWriteStream( saveLocation + '/' + fileName + '.JSON' );
		stream.once( 'open', function(){
			stream.end( postData );
		});

		stream.on( 'error', function( error ){
			console.log( 'file error: ' + error );
		});

		stream.on( 'close', function(){
			response.writeHead( 200, { "Content-Type" : "text/plain" });
			response.write( JSON.stringify({ success : postDataJSON.selection.name + ' Saved!' }));
			response.end();
		});
	});
}

function _load( loadLocation, fileName, response, postData, postDataJSON ){
	path.exists( loadLocation, function( exists ){
		if( !exists ){
			errorHandler.error500( response, JSON.stringify({ error : 'No saved characters' }));
			return
		}
		path.exists( loadLocation + '/' + fileName + '.JSON', function( exists ){
			if( !exists ){
				errorHandler.error500( response, JSON.stringify({ error : loadLocation + '/' + fileName + '.JSON does not exist' }));
				return
			}

			var stream      = fs.createReadStream( loadLocation + '/' + fileName + '.JSON' ),
				fileContent = '';
			stream.once( 'open', function( fd ){
				stream.on( 'data', function( data ){
					fileContent = fileContent + data;
				});

				stream.on( 'error', function( error ){
					console.log( 'file error: ' + error );
				});

				stream.on( 'end', function(){
					// console.log( 'arguments in end', arguments );
					response.writeHead( 200, { "Content-Type" : "text/plain" });
					response.write( fileContent );
					response.end();
				});
			});
		});
	});
}

function _characterIO( type, response, postData ){
	console.log( 'Request handler ' + type + ' was called.' );
	var postData = querystring.parse( postData ).character;
	if( typeof( postData ) == 'undefined' || postData.length == 0 ){
		errorHandler.error500( response, JSON.stringify({ error : 'No post data' }));
		return;
	}

	var postDataJSON = JSON.parse( postData );

	if( !postDataJSON.selection.name || postDataJSON.selection.name.length == 0 ){
		errorHandler.error500( response, JSON.stringify({ error : 'Post data has no name value', errorField: 'name' }));
		return
	}

	var fileName     = postDataJSON.selection.name.replace( /\W*/g, '' ),
		saveLocation = path.join( process.cwd(), '/saveCharacter' );
	console.log( 'fileName', fileName );

	switch( type ){
		case 'save':
			_save( saveLocation, fileName, response, postData, postDataJSON );
			break;
		case 'load':
			_load( saveLocation, fileName, response, postData, postDataJSON );
			break;
		default:
			console.log( 'Missing or unknown type definition' );
	}
}

function save( response, postData ){
	_characterIO( 'save', response, postData );
}

function load( response, postData ){
	_characterIO( 'load', response, postData );
}

exports.dft   = dft;
exports.index = index;
exports.save  = save;
exports.load  = load;