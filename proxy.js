var http = require('http'),
	httpProxy = require('http-proxy'),
	 util = require('util'),
	 Cookies = require('cookies'),
  uuid = require('node-uuid'),
  redback = require('redback').createClient(),
httpProxy = require('http-proxy'),
ratelimit = redback.createRateLimit('requests', {bucket_interval: 5, 
	bucket_span:24*3600}),
redis = require("redis"),
client = redis.createClient(),
client2 = redis.createClient(6380);






var proxy = new httpProxy.RoutingProxy();
var serveronline = 'dk1online';
var numReqs = 0;
process.setMaxListeners(0);
client.setMaxListeners(0);
client2.setMaxListeners(0);
var numReqs = 0;
function myProxy(req, res){
	numReqs += 1;
	process.send({ cmd: 'notify', src: process.pid, num: numReqs });
	
	
	var myip = req.connection.remoteAddress || req.headers.host || req.headers['x-forwarded-for'];
	ratelimit.add(myip);
		
	var buffer = httpProxy.buffer(req);
		
		
	
	ratelimit.count(myip, 2, function(error2, c2){
		if (!error2) {
			if (c2 > 10) {
				res.end('IP: ' + myip + ' too much requests(' + c2 + ')');
			} else {
				//console.log('myip: ' + myip);
				//req.session.uuid = req.session.uuid || uuid.v1();	
				var cooki = new Cookies( req, res );
				var aspnetid = cooki.get('ASP.NET_SessionId');
				var myid = aspnetid || uuid.v1() ;
				cooki.set('ASP.NET_SessionId', myid);
				ratelimit.add(myid);
				ratelimit.count(myid, 4, function (err, count) {		
				if (count > 20) {
					res.end('Bạn vui lòng không refresh (reload) trang web liên tục. ' + '(' + count + ')');
				} else {							
						
						
					//	console.log('myid: ' + myid);
						
						client.zcard(serveronline, function(error, card){
							
							
							if (!error) {
								if (card < 500) {
											
										if (card > 450) {		
											var min = 120 * 1000;
											var ago = Date.now() - min;
											var args1 = [serveronline, '-inf', ago];
											client.zremrangebyscore(args1, function(err, countusers){
													if (!err) {
														console.log('removed ' + countusers );										
													} else throw err;
											});		
										}	
											
										var args = [ serveronline, Date.now(), myid ];
										
										client.zadd(args, function(err, response){
											if (err) {
												console.log('error zadddd');
												res.end('error: please try later');
												throw err;
											}
											else {
												proxy.proxyRequest(req, res, {
													host: '127.0.0.1',
													port: 81,
													buffer: buffer
												});
											}
										});
										
								} else {
									
									client2.get('ip', function(error, resp){
											if (!error) {
												if (resp){	
													client2.get('val', function(er, val){
														if (!er) {
															if (val < 450) {
																	var url = './' + resp;
																	console.log(url);
																	var s1 = fs.readFile(url, function(errr, content){															
																		if (!errr) {
																			return res.end(content);
																		} else {
																			return res.end('error!');
																		}
																	});
																//res.end('Máy chủ quá tải, vui lòng đến địa chỉ sau để tiếp tục đăng ký:  ' + resp);
															} else {
																return res.end('Hệ thống đang quá tải, bạn vui lòng nhấn F5 sau ít phút. ');
															}
														}
													});														
												} 
											}
										});
											
									
								}
							
							} else {
								console.log('error get card');
								res.end('error');
								throw error;
							}
						});
					}
				});	
			}
		
		} else {
			console.log('ratelimit error');
			res.end('error2');
			throw error2;
		}
	});
}
http.createServer(myProxy).listen(80);
