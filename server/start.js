var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {
	dft     : requestHandlers.dft,
	'/'     : requestHandlers.index, // root
	getData : requestHandlers.getData, // pull data from redis
	setData : requestHandlers.setData, // given JSON data store in the Persistant store
	newData : requestHandlers.newData, // present a form to input some JSON data
	'/save' : requestHandlers.save,
	'/load' : requestHandlers.load
}

server.start(router.route, handle);