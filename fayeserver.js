var Faye   = require('faye'),
    bayeux = new Faye.NodeAdapter({mount: '/faye'});
var redis = require("redis"),
http = require('http'),
client = redis.createClient(),
client2 = redis.createClient(6380),
client3 = redis.createClient(6381),
staticServer = require('node-static'),
fs = require('fs');
var clientfaye = new Faye.Client('http://localhost:8000/faye');
var file = new(staticServer.Server)('./public');

  setInterval(function(){
			client.zcard('dk3online', function(error, card){						
				client.set('ip', 'http://s3.hpu.edu.vn');
				client.set('val', card);
				clientfaye.publish('/dk3', {text: card});
				
			}) ;
			client2.zcard('dk1online', function(error, card){	
				client.get('val', function(err, resp){
					if (card < resp) {
						client.set('ip', 'http://s1.hpu.edu.vn');
						client.set('val', card);
					}
				});
				clientfaye.publish('/dk1', {text: card});
			}) ;
			client3.zcard('dk2online', function(error, card){		
				client.get('val', function(err, resp){
					if (card < resp) {
						client.set('ip', 'http://s2.hpu.edu.vn');
						client.set('val', card);
					} 
				});
				clientfaye.publish('/dk2', {text: card});
			}) ;
   }, 1000);
var index = fs.readFileSync('./public/monitor.html');
var server = http.createServer(function(request, response) {
	
		request.addListener('end', function () {     
			file.serve(request, response);
		})
	
	
});   
bayeux.attach(server);
server.listen(8000);
