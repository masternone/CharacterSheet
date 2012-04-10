var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {
	dft     : requestHandlers.dft,
	'/'     : requestHandlers.index, //root
	'/save' : requestHandlers.save,
	'/load' : requestHandlers.load
}

server.start(router.route, handle);