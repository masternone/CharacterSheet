var http = require( 'http' ),
	auth = require( 'http-auth' ),
	url = require( 'url' );

var basic = auth({
	authRealm : "Private area.",
	authFile : __dirname + '/../auth/users.htpasswd'
});

function start( route, handle ){
	//console.log( 'start arguments', arguments );
	var onRequest = function( request, response ){
		//console.log( 'onRequest arguments', arguments );
		basic.apply( request, response, function(){
			// console.log( 'basic.auth arguments', arguments );
			var postData = "";
			var pathname = url.parse( request.url ).pathname;
			// console.log( "Request for " + pathname + " received." );
			request.setEncoding( "utf8" );
			request.addListener( "data", function( postDataChunk ){
				postData += postDataChunk;
				// console.log( "Received POST data chunk '" + postDataChunk + "'." );
			});
			request.addListener( "end", function(){
				route( handle, pathname, response, postData );
			});
		});
	},
	    port = typeof( process.env.C9_PORT ) != 'undefined' ? process.env.C9_PORT : ( process.argv.length >= 3 ? process.argv[2] : 8888 );
	http.createServer(onRequest).listen( port, '0.0.0.0' );
	// console.log( 'Server has started. http://localhost:' + port );
}

exports.start = start;