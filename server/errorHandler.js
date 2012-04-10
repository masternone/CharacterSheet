function error204( response ){
	response.writeHead( 204, { "Content-Type": "text/plain" });  
	response.end();
}

function error404( response ){
	response.writeHead( 404, { "Content-Type": "text/plain" });  
	response.write( "404 Not Found\n" );  
	response.end();
}

function error500( response, error ){
	response.writeHead( 500, { "Content-Type": "text/plain" });
	response.write( error + "\n" );
	response.end();
}

exports.error204 = error204;
exports.error404 = error404;
exports.error500 = error500;