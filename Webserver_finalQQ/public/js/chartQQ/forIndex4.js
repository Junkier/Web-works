function index4_fieldQQ(data){
	
	// Generate dict by field names
	var good_group = genGroup_index4('indices');
	
	
	// Counting the post number by key (fields_name)
	for(var num in data){
		var time = moment(new Date(data[num]["_source"]["time"].split(" ")[0].replace(/-/g,'/'))).format("YYYY-MM-DD");	
		good_group[data[num]["_index"]][time] += 1;
	}
	
	// Fix data format in order to become nvd3 chart input.
	var good_data = fix_data(good_group);

	genChart_index4(good_data , '#chart_source svg');
	
}

function index4_sourceQQ(data){
	
	// Generate dict by source names
	var good_group = genGroup_index4('sources');
	// console.log(good_group);
	// Counting the post number by key (source_names)
	for(var num in data){
		// console.log(data[num]["_type"]);
		var time = moment(new Date(data[num]["_source"]["time"].split(" ")[0].replace(/-/g,'/'))).format("YYYY-MM-DD");	
		good_group[data[num]["_type"]][time] += 1;
	
	}

	// Fix data format in order to become nvd3 chart input.
	var good_data = fix_data(good_group);

	genChart_index4(good_data , '#chart_source svg');
	
	
}

function genGroup_index4(type){
	
	if (type == 'indices'){
		// By Fields
		var key_names = $("input:checked").parents().siblings('select').map(function(){ 
				return $(this).attr('id').split("-")[0] ; 
			}).get();


	} else {
		// By Sources
		var key_names = $("input:checked").map(function(){
				return $(this).parents('li').attr("class").split(' ')[0];
			}).get();
			
	}
	
	
	
	
	var group = {};
	
	var start_time = moment( $("input[name='start_time']").val() , "YYYY年MM月DD日" );
	var end_time = moment( $("input[name='end_time']").val() , "YYYY年MM月DD日" );
	
	var diff_time = end_time.diff(start_time,"days",false);
	
	// Get every key based on day
	// ex : '2015-01-01' : 0 , '2015-01-02' : 0 , '2015-01-03' : 0 ,
	//  	'2015-01-04' : 0 , ... , '2015-01-30' ( It's up to end_time.)
	for(var name in key_names){

		var QQ_time = moment($("input[name='start_time']").val(), "YYYY年MM月DD日" );
		
		group[key_names[name]] = {};
		
		for (var day = 0 ; day <= diff_time ; day++){
			if (day != 0 ){
				QQ_time.add(1 , "days");
			} 

			group[key_names[name]][QQ_time.format("YYYY-MM-DD")] = 0 ;
		
		}
				
	}
	
	delete group["active"];


	return group ;
	
	
}


function fix_data(init_group){
	
	// Input  : {"forum" : {"date1":"post_count1" , "date2":"post_count2" , ....}}
	// Output :
	//   [
	//       {  "key": "forum",
	//          "values" : [["date","post_count"],["date","post_count"],...]
	//       } , {...} , ...
	//   ]
	//  And the "values" should be sorted by "date" in Array .
	
	var final_data = [];
	
	for(var field in init_group){
		
	
		var fix_group = { "key": field , "values":[] };
		
		for(var time in init_group[field]){
			fix_group["values"].push( [new Date(time).getTime(),init_group[field][time]] );
		}
		
		// Sorting Array .
		fix_group["values"] = fix_group["values"].sort(function(a,b){

			// MilliSeconds to minus for sorting 
			// ex : a[0] = 1427000 , b[0] = 1426000
			// 1427000 - 1426000 > 0 , so a is in front of b . 
			
			return a[0] - b[0] ; 
		});
		
		final_data.push(fix_group);
		
		fix_group = null ;
	}
	
	return final_data;
	
}


function genChart_index4(data , _id){
	
	// remove initial chart
	d3.selectAll(".Index4_Chart svg > *").remove();
	 // d3.selectAll('.Index4_Chart svg').selectAll('*').remove();
	 d3.selectAll('.StackedAreaChart').selectAll('.nvtooltip').remove();
	// QQ.selectAll("*").remove();
	
	nv.addGraph(function() {
    var chart = nv.models.stackedAreaChart()
                  .margin({right: 100})
                  .x(function(d) { return d[0] })   //We can modify the data accessor functions...
                  .y(function(d) { return d[1] })   //...in case your data is formatted differently.
                  .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
                  .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
                  //.transitionDuration(500)  // 神秘會出事= =
                  .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
			
                  // .clipEdge(true);
	
	chart.xAxis
		 .tickFormat(function(d){

				return d3.time.format('%Y-%m-%d')(new Date(d));
		 });

    chart.yAxis
         .tickFormat(d3.format('d'));

    d3.select(_id)
      .datum(data)
	  .transition().duration(5000)
      .call(chart);
	  
	  
	// If this chart appeared , we need to refresh this chart one time.
	$('.topic_content[show_chart_QQ="Index4"]').one('click',function(){
		// If it doesn't work , please check $('#chart_8_QQ').highcharts().reflow() in dosomething.js . 
		chart.update();
	});

    nv.utils.windowResize(chart.update);

    return chart;
  });
	
	// return true;
}
