let sephy  = require('./core/sephy');
let server = new sephy({
	mode: 'development'
});

server.run((sephy)=> {
	
	let io = sephy.io;

	io.on('connection', function(client) {  
	    console.log('Client connected...');
	});

    console.log('Servidor rodando na porta %s', sephy.settings.port);

},(message, error) => {

	console.error(message+": %s",error);

});