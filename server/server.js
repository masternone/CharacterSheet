var http = require( "http" );
var url = require( "url" );

function start( route, handle ){
	function onRequest( request, response ){
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
	}
	port = process.argv.length >= 3 ? process.argv[2] : 8888
	http.createServer(onRequest).listen( port );
	console.log( 'Server has started. http://localhost:' + port );
}

exports.start = start;