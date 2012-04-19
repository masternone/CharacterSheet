var http = require( 'http' ),
	auth = require( 'http-auth' ),
	url  = require( 'url' ),
	path = require( "path" );

var basic,
	authFile = __dirname + '/../auth/users.htpasswd';
path.exists( authFile, function( exists ){
	if( exists ){
		basic = auth({
			authRealm : "Private area.",
			authFile  : authFile
		});
	}
});

function start( route, handle ){
	var onRequest = function( request, response ){
		var requestWorker = function( request, response ){
			var postData = "";
			var pathname = url.parse( request.url ).pathname;
			request.setEncoding( "utf8" );
			request.addListener( "data", function( postDataChunk ){
				postData += postDataChunk;
			});
			request.addListener( "end", function(){
				route( handle, pathname, response, postData );
			});
		}
		// This if block allow for the use of http-basic optionality
		if( basic && typeof( basic.apply ) == 'function' && process.argv.length >= 4 && process.argv[3] ){
			basic.apply( request, response, function(){
				// console.log( 'basic arguments', arguments );
				requestWorker( request, response );
			});
		} else {
			requestWorker( request, response );
		}
	},
		port = typeof( process.env.C9_PORT ) != 'undefined' ? process.env.C9_PORT : ( process.argv.length >= 3 && process.argv[2] ? process.argv[2] : 8888 );
	http.createServer(onRequest).listen( port, '0.0.0.0' );
	// console.log( 'Server has started. http://localhost:' + port );
}

exports.start = start;