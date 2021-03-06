$( document ).ready(function() {
	var color_values = {
		"SAD": "#2391cc",
		"CALM": "#91b460",
		"DISGUSTED":"#6d1f47",
		"HAPPY":"#e6db67",
		"CONFUSED":"#574285",
		"SURPRISED":"#a0506b",
		"ANGRY":"#a6321b"
	}

	var data_list = [];
	var log_list = [];

	var start_tick_time = 1499359057316;
	var draw_count = 0
	//var start_tick_time = Date.now();

	var input_data = "data.json"

	var start_time = Date.now();

	var limit = 60 * 1,		// Graph limit x-axis
	  duration = 400,	// refresh duration
	  now = new Date(Date.now() - duration)

	var width = $(window).width() * 0.7 - 10
	var height = 500

	var x = d3.time.scale()
	  .domain([now - (limit - 2), now - duration])
	  .range([0, width])

	y_axis_max_value = 100

	var y = d3.scale.linear()
	  .domain([-100, 100])
	  .range([height, 0])

	var line = d3.svg.line()
	  .interpolate('basis')
	  .x(function(d, i) {
	      return x(now - (limit - 1 - i) * duration)
	  })
	  .y(function(d) {
	      return y(d)
	  })

	var emotion_value = new Map();

	svg_value = d3.select('.graph_value').append('svg')
	  .attr('class', 'chart')
	  .attr('width', width)
	  .attr('height', height + 50)
	  .attr('transform', 'translate(0, 20)')

	var graph_value_svg = svg_value.append('g')
   
	// for (var y_axis_value =0; y_axis_value <=y_axis_max_value; y_axis_value+=50)
	// {
	// 	graph_value_svg.append("text")
 //        .attr("transform", "rotate(0)")
 //        .attr("y", 6)
 //        .attr("x", 0)
 //        .attr("dy", ".71em")
 //        .style("text-anchor", "end")
 //        .attr("class", "shadow")
 //        .text("Price ($)");
	// }

	var header_offset = 40
	$(".header").height(header_offset)
	$(".data_log_container").height($(window).height() - header_offset)
	$(".graph_value").height( ($(window).height() - header_offset) * 0.7 - 20)
	$(".graph_emotion").height( ($(window).height() - header_offset) * 0.3 - 20)
	
	var paths = graph_value_svg.append('g')
	//var circles = graph_value_svg.append('g')

	var group = {
			value: 0,
			color: 'orange',
			data: d3.range(limit).map(function() {
			  return 0
			})
		}

	group.path = paths.append('path')
	  .data([group.data])
	  .attr('class', name + ' graph_value')
	  .style('stroke', group.color)

 	var rect = svg_value.append("g")
 		.attr('transform', 'translate(0, 0)')
       	.append("rect")
        .attr("x", 0)
        .attr("y", 10)
        .attr("width", 30)
        .attr("height", height)
        .attr("fill", "#0d0c11")

        

	var axis = svg_value.append('g')
	  .attr('class', 'x axis')
	  .attr('transform', 'translate(30,' + height + ')')
	  .call(x.axis = d3.svg.axis().scale(x).orient('bottom'))

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(5);

	 // Add the Y Axis
    svg_value.append("g")
        .attr("class", "y axis")
        .attr('transform', 'translate(30, 0)')
        .call(yAxis);

	tick()

	function sortlist() {
		arrTexts = new Array();
		for (i = 0; i< log_list.length; i++)
		{
			arrTexts[i] = JSON.stringify(log_list[i]);
		}

		arrTexts.sort();
		arrTexts.reverse();

		$(".data_log_item").html("")
		for (i = 0; i < arrTexts.length; i++)
		{
			json_obj = JSON.parse(arrTexts[i]);
			div_str = '<div class="data_log_detail_item">\
			  			 <span>' + arrTexts[i] + '</span>\
			         <div class="log_emotion">\
			          <div class="emotion_circle" style="border-color: ' + color_values[json_obj["emotion"]] +';"></div>\
			          <span class="emotion_span">' + json_obj["emotion"] + '</span>\
			         </div>\
			  		</div>'

			$(".data_log_item").append(div_str);
		}
	}

  	function tick() {
	  	d3.text(input_data, function(d) {
		    data_str = d.split("\n");
		    data_list = [];

		    for (var i = 0; i< data_str.length; i++) {
		    	if (data_str[i] != ""){
		        	obj = JSON.parse(data_str[i]);
		        	data_list.push({"timestamp":obj["timestamp"], "emotion":obj["emotion"], "confidence":obj["confidence"]});
		    	}
		    }
		    
		    data_list.sort(GetSortOrder("timestamp")); //Pass the attribute to be sorted on  

		    // temp_data_list = []
		    // for (var i = 0; i < 5; i++)
		    // 	temp_data_list.push(data_list[i]);
		    // draw_graph_value(temp_data_list);
		    
		    draw_graph_value(data_list);
		});
	}

	function draw_graph_value(data_list)
	{
		now = Date.now();

		offset_from_start  = (now - start_time);
		// render_time = start_tick_time + offset_from_start
		//console.log("Now = " + now + ", Start Tick =" + start_tick_time + ", Render = " + render_time + ", Offset = " + offset_from_start);

		// real_data_list = []
		// for (var i =0; i<data_list.length; i++)
		// {
		// 	if (data_list[i]["timestamp"] > render_time){
		// 		real_data_list.push(data_list[i]);

		// 	}
		// }
			

		// Get First item
		if (draw_count < data_list.length)
		{
			current_data = data_list[draw_count]
			y_value = current_data["confidence"]
			group.data.push(y_value);
			log_list.push(current_data);
			
			sortlist()

			//Count emotion value as realtime
			emotion = current_data["emotion"]
			if (emotion_value.has(emotion))
				emotion_value.set(emotion, emotion_value.get(emotion) + 1)
			else
				emotion_value.set(emotion, 1)

			$(".graph_emotion").html("")
			
			var emotion_div_str = ""
			emotion_value.forEach(function(value, key){
				emotion_div_str += '<div class="input_emotion">\
					          <div class="inputTitle">\
					            <div class="emotion_circle" style="border-color: ' + color_values[key] +';"></div>\
					            <span>' + key + '</span>\
					          </div>\
					          <div class="emotion_below">\
					            <div class="statsTitle">Number of Events</div>\
					            <div class="statsNumber ng-binding">' + value + '</div>\
					          </div>\
					        </div>'
			})

			//li_str += "<li>TOTAL:***" + (draw_count + 1) +"***</li>"

			$(".graph_emotion").append(emotion_div_str)
		
			draw_count += 1
		}
		
		group.path.attr('d', line)
		
		// Draw circles and update item( redraw circles)
		// group.circle = circles.selectAll("circle")
	 //       .data(group.data);

	 //    group.circle.exit().remove()
	 //       .append("circle")
	 //       .attr("r", 0);

	 //    group.circle.transition()
	 //    	.duration(0)
		// 	.attr("cx", function(d, i) {

  //            	return x(now - (limit - 1 - i) * duration)
  //            })
		// 	.attr("cy", function (d, i) { return y(d); })
		// 	.attr("r", function (d) { return 2; })
		// 	.style("fill", function (d) { return d.color;});
		
		x_axis_time = now

		// Shift domain
		x.domain([x_axis_time - (limit - 2) * duration, x_axis_time - duration])

		// Slide x-axis left
		axis.transition()
		  .duration(duration)
		  .ease('linear')
		  .call(x.axis)

		//Slide paths left
		paths.attr('transform', null)
		  .transition()
		  .duration(duration)
		  .ease('linear')
		  .attr('transform', 'translate(' + x(x_axis_time - (limit - 1) * duration) + ')')
		  .each('end', tick)

		// // Remove oldest data point from each group
	  	group.data.shift()
	  	

	}

});

function GetSortOrder(prop) {  
    return function(a, b) {  
        if (a[prop] > b[prop]) {  
            return 1;  
        } else if (a[prop] < b[prop]) {  
            return -1;  
        }  
        return 0;  
    }  
}  

