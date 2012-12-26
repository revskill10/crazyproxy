
var redis = require("redis"),
client = redis.createClient();
client2 = redis.createClient(6380);

  setInterval(function(){
			client2.get('ip', function(error, ip){						
				if (!error) {
					client2.get('val', function(err, val){
						console.log('ip: ' + ip + ', val: ' + val);
						client.set('val', val);
						client.set('ip', ip);
					});
				}
			}) ;
   }, 1000);
