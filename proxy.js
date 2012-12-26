var http = require('http'),
  connect = require('connect'),
	httpProxy = require('http-proxy'),
	 util = require('util'),
  RedisStore = require('connect-redis')(connect),
  uuid = require('node-uuid'),
  redback = require('redback').createClient(),
httpProxy = require('http-proxy'),
ratelimit = redback.createRateLimit('requests', {bucket_interval: 5, 
	bucket_span:24*3600}),
redis = require("redis"),
client = redis.createClient(),
i18n = require('connect-i18n'),
client2 = redis.createClient(6379, '10.1.0.237');  
var app = connect()   
  .use(connect.cookieParser())
  .use(connect.cookieSession({store: new RedisStore(6379,'localhost'), secret: 'proxy'
	, cookie: {httpOnly: true, maxAge: 5 * 60 * 1000 }})) 
  .use(i18n({default_locale: 'vi-vi'}))    
  .use(myProxy);





var proxy = new httpProxy.RoutingProxy();
function myProxy(req, res){
	
	
	var myip = req.connection.remoteAddress || req.headers.host || req.headers['x-forwarded-for'];
	ratelimit.add(myip);
		
	var buffer = httpProxy.buffer(req);
		
		
	
	ratelimit.count(myip, 5, function(error2, c2){
		if (c2 > 100) {
			res.end('IP: ' + myip + ' too much requests(' + c2 + ')');
		} else {
			console.log('myip: ' + myip);
			req.session.uuid = req.session.uuid || uuid.v1();	
			var myid = req.session.uuid;
			ratelimit.add(myid);
			ratelimit.count(myid, 10, function (err, count) {		
			if (count > 100) {
				res.end('Bạn vui lòng không refresh (reload) trang web liên tục. ' + '(' + count + ')');
			} else {							
					
					
					console.log('myid: ' + myid);
					//client.scard('dk3', function(error, card){
					client.zcard('dk2online', function(error, card){
						client.set('card2', card);
						if (card < 500) {
								var args = [ 'dk2online', Date.now(), myid ];
								client.zadd(args, function(err, response){
									if (err) throw err;
									proxy.proxyRequest(req, res, {
										host: '127.0.0.1',
										port: 81,
										buffer: buffer
									});
								});
							
						} else {

							if (card > 0) {								
								var min = 120 * 1000;
								var ago = Date.now() - min;
								var args1 = ['dk2online', '-inf', ago];
								client.zremrangebyscore(args1, function(err, countusers){
										console.log('removed ' + countusers );
									});
							}
								var args2 = ['dk2online', myid];
								client.zrank(args2, function(err, resp){
									if (!err) {
										if (resp) {
												proxy.proxyRequest(req, res, {
												host: '127.0.0.1',
												port: 81,
												buffer: buffer
											});
										} else {
											res.end('Hệ thống đang quá tải, bạn vui lòng nhấn F5 sau ít phút. ');
										}
									} else {
										res.end('Hệ thống đang quá tải, bạn vui lòng nhấn F5 sau ít phút. ');
									}	
							
								});
						}
					});
				}
			});	
		}
	});
}
http.createServer(app).listen(80);
