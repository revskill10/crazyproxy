<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
    <title>Monitoring</title>
  <link rel="stylesheet" href="jqueryui.css" type="text/css" media="screen" />
 
	<script type="text/javascript" src="http://dkstatus.hpu.edu.vn:8000/faye/client.js"></script>
    <script type="text/javascript" src="jquery.min.js"></script>   
  <script type="text/javascript" src="jqueryui.min.js"></script>
	<script src="three.min.js"></script>
   <script src="highchart.js"></script>
<script src="exporting.js"></script>
    <script type="text/javascript">
      $(document).ready(function(){
			dkk1 = 0; dkk2 = 0; dkk3 = 0;
			var client = new Faye.Client('http://dkstatus.hpu.edu.vn:8000/faye');
			
			var dk1 = client.subscribe('/dk1', function(message) {				 
                  $("#dk1").html(message.text);		
				  dkk1 = message.text;
			});
			var dk2 = client.subscribe('/dk2', function(message) {				 
                  $("#dk2").html(message.text);	
				  dkk2 = message.text;
			});
			var dk3 = client.subscribe('/dk3', function(message) {				 
                  $("#dk3").html(message.text);		
				  dkk3 = message.text;
			});
			client.subscribe('/cpudk1', function(message) {				 
                  $("#cpudk1").html(JSON.stringify(message.text));	
				  var sum1 = 0;
					 for (var k in message.text) {
						if (message.text.hasOwnProperty(k)) {
						   sum1 += parseInt(message.text[k]);
						}
					}
					$("#sum1").html(sum1);
			});
			client.subscribe('/cpudk2', function(message) {				 
                  $("#cpudk2").html(JSON.stringify(message.text));	
					var sum2 = 0;
					 for (var k in message.text) {
						if (message.text.hasOwnProperty(k)) {
						   sum2 += parseInt(message.text[k]);
						}
					}
					$("#sum2").html(sum2);				  
			});
			client.subscribe('/cpudk3', function(message) {				 
                  $("#cpudk3").html(JSON.stringify(message.text));	
					var sum3 = 0;
					 for (var k in message.text) {
						if (message.text.hasOwnProperty(k)) {
						   sum3 += parseInt(message.text[k]);
						}
					}
					$("#sum3").html(sum3);
			});
			Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
    
        var chart;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container2',
                type: 'spline',
                marginRight: 10,
                events: {
                    load: function() {    
                        // set up the updating of the chart each second
                        var series = this.series[0],
						series2 = this.series[1],
						series3 = this.series[2];
                        setInterval(function() {
                            var x = (new Date()).getTime(); // current time
                                
                            series.addPoint([x, dkk1], true, true);
							series2.addPoint([x, dkk2], true, true);
							series3.addPoint([x, dkk3], true, true);
                        }, 1000);
                    }
                }
            },
            title: {
                text: 'Đăng ký'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 50
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                layout: 'horizontal',
                align: 'middle',
                verticalAlign: 'top',
                x: -10,
                y: 5,
                borderWidth: 0
            },
            series: [{
                name: 'DK1',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
    
                    for (i = -59; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: 0
                        });
                    }
                    return data;
                })()
            },{
                name: 'DK2',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
    
                    for (i = -59; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: 0
                        });
                    }
                    return data;
                })()
            },{
                name: 'DK3',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
    
                    for (i = -59; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: 0
                        });
                    }
                    return data;
                })()
            }]
        });
			
		
			});
    </script>
  </head>
  <body>
  
   
    <div> DK1: <span id="dk1"></span> [ <span id="cpudk1"></span> ]<span id="sum1"></span></div>
	<div> DK2: <span id="dk2"></span> [ <span id="cpudk2"></span> ]<span id="sum2"></span></div>
	<div> DK3: <span id="dk3"></span> [ <span id="cpudk3"></span> ]<span id="sum3"></span></div>
	
    
    <div id="container2" style="min-width: 400px; height: 400px; margin: 0 auto"></div>
	
    
 
</div>
  </body>
</html>
