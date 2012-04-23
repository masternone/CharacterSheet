var querystring  = require( 'querystring' ),
	path         = require( "path" ),
	fs           = require( "fs" ),
	util         = require( 'util' ),
	errorHandler = require( './errorHandler' ),
	staticFile   = require( './staticFile' ),
	JSONRedis    = require( './lib/JSONRedis'),
	dataTemplate = require( '../template/data' );

function dft( response, pathName, postData ){
	// console.log( "Request handler dft on " + pathName + " was called.");
	staticFile.out( response, pathName );
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
			response.writeHead( 200, { "Content-Type" : "application/json" });
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
					response.writeHead( 200, { "Content-Type" : "application/json" });
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

function newData( response, postData, init ){
	// console.log( 'newData arguments', arguments );
	JSONRedis.toJSON( init, init, 0, function( error, result ){
		// console.log( 'result', result );
		if( !result ){
			result = '';
		}

		response.writeHead( 200, { "Content-Type" : "text/html" });
		response.write( dataTemplate.html.replace( /<< init >>/g, init ).replace( /<< data >>/g, result ));
		response.end();
	});
}

function setData( response, postData, init ){
	// console.log( 'data arguments', arguments );
	console.log( 'postData', postData );
	console.log( 'urldecode', decodeURIComponent( postData ));
	console.log( 'JSONParsed', JSON.parse( decodeURIComponent( postData )));
	JSONRedis.toRedis( init, postData, function( error, success ){
		if( error ){
			errorHandler.error500( response, JSON.stringify({ error : 'Failed to store data for ' + init }));
			return
		}
		response.writeHead( 200, { "Content-Type" : "application/json" });
		response.write( JSON.stringify({ sucess : 'Data for ' + init + ' stored!' }));
		response.end();
	});
}

function getData( response, postData, init ){
	// console.log( 'data arguments', arguments );
	JSONRedis.toJSON( init, init, 0, function( error, result ){
		// console.log( 'result', result );
		if( error ){
			errorHandler.error500( response, JSON.stringify({ error : 'Failed to retrive data for ' + init }));
			return
		}
		if( !result ){
			console.log( 'No data for %s in the Data Store getting data for %s from %s', init, init, '/data/' + init + '.JSON' );
			dft( response, '/data/' + init + '.JSON', postData );
			return;
		}
		response.writeHead( 200, { "Content-Type" : "application/json" });
		response.write( result );
		response.end();
	});
}

function index( response, postData ){
	// console.log( "Request handler 'index' was called." );
	staticFile.out( response, 'index.html' );
}

exports.dft     = dft;
exports.save    = save;
exports.load    = load;
exports.getData = getData;
exports.setData = setData;
exports.newData = newData;
exports.index   = index;
