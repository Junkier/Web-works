function index3QQ(data){

	var time_list = genGroup_index3(false);
	var time_group = time_list[0] ,
		time_mode  = time_list[1] ;
		 
	var author_group = {};
	
	// Counting the post number by key (fields_name)
	for(var num in data){

		var time   = moment(new Date(data[num]["_source"]["time"].split(" ")[0].replace(/-/g,'/'))).format("YYYY-MM-DD"),
			title  = data[num]["_source"]["title"] ,
			url    = data[num]["_source"]["url"] , 
			author = data[num]["_source"]['author'] ;  
		
		// Change time by mode
		if(time_mode == 'Week'){
			time = encoding_time_to_week(new Date(time));
		} else if (time_mode == 'Month'){
			time = time.substring(0,7);
		}
		
		// Post_count +1  by date
		time_group[time]["post_count"] += 1;
		
		// Then we put the document into "post" list
		time_group[time]["posts"].push({
			"title" :  title,
			"author" : author,
			"url" : url
		})
		
		
		// Generate Author group
		if(!author_group[author]){
			author_group[author] = 1 ;
		} else {
			author_group[author] += 1 ; 
		}
		
		
		time = null , title = null , url = null , author = null ;
		
	}
	
	
	
	if(time_mode == 'Week'){
		time_group = decoding_week_to_time(time_group);
	}
	
	// Get the sorted data group by author   and  use it.
	var author_listQQ = sorting_author(author_group);
	genList_show_author(author_listQQ,10);
	
	// Get the sorted data group by time     and  use it.
	var title_listQQ = sorting_time(time_group);
	genList_show_list(title_listQQ);
	
	// Get the nvd3 chart data				 and  use it.
	//var chart_dataQQ = null ; 
	var chart_dataQQ = genChart_data(time_group);
	genChart_index3(chart_dataQQ);
	
	
	// For Heroes Click
	$('.AuthorTop10 > span').click(hight_light_list);
	
	// For Bar Click
	// catch_me_if_you_can  , write in the nvd3 callback func.
}

function genGroup_index3(seperate_type){
	
	// seperate_type : consider by day , week , month or not
	// False : only by day
	// True  : by day , week , month
	
	var group = {} , 
		mode = ''  ;

	var start_time = moment( $("input[name='start_time']").val() , "YYYY年MM月DD日" );
	var end_time = moment( $("input[name='end_time']").val() , "YYYY年MM月DD日" );
	
	var day_diff = end_time.diff(start_time,"days",false);
	
	if( !seperate_type || day_diff <=30){    // By Day
		mode = 'Day';
		for (var day = 0 ; day <= day_diff ; day++){
			if (day != 0 ){
				start_time.add(1 , "days");
			
			} 

			group[start_time.format("YYYY-MM-DD")] = { 
				"post_count" : 0 , 
				"posts" : []
			} ;
		
		}
		
	} else if (seperate_type && day_diff >=31 && day_diff <= 90){  // By Week
	
		mode = 'Week';
		
		while( start_time <= end_time){
			
			group[encoding_time_to_week(new Date(start_time.format("YYYY-MM-DD")))] = { 
				"post_count" : 0 , 
				"posts" : []
			} ;
			start_time.add(1 , "days");
		}

		
	} else if( seperate_type && day_diff > 90){  // By Month
		mode = 'Month';
		
		// Punch into MM/01 , or it'll make mysterious error.	
		var month_diff = (end_time.year() - start_time.year())*12 + (end_time.month() - start_time.month());
	
		start_time = moment(new Date(start_time.format("YYYY-MM")));
		
		for (var month = 0 ; month <= month_diff ; month++){
			
			if (month != 0 ){
				start_time.add(1 , "months");
			} 
			
			group[start_time.format("YYYY-MM")] = { 
				"post_count" : 0 , 
				"posts" : []
			} ;
		
		}
	}
	

				
	return [group , mode] ;
	
}


function encoding_time_to_week(date){
	// In  :  Date() , ex : new Date('2015-01-28') 
	// Out :  week code   , ex : '2015_47_week' , '2016_32_week'
	
	var our_time  = date ;
	var this_year = date.toISOString().substring(0,4);
	var init_time = new Date(this_year,0,1) ;
	
	var week_num  = Math.ceil(((our_time - init_time)/(1000*60*60*24))/7.0);

	return this_year + '_' + week_num.toString() + '_week'; 

	
}

function decoding_week_to_time(data){
	// In  :  week code   , ex : '2015_47_week' , '2016_32_week'
	// Out :  date string , ex : '2015-11-24'
	
	var fix_group = {}
	for(var time in data){
		var this_year = time.split("_")[0];
		var this_date = new Date(this_year);
		this_date.setDate(parseInt(time.split("_")[1])*7);
		fix_group[this_date.toISOString().substring(0,10)] = data[time];
	}
	
	return fix_group;
	
}

function sorting_author(dict){
	
	// In  : dict
	// ex  :  { 'Jeff': 18 , "Apple":20 , "Leo":99 , ...}

	// Out : Sorted list 
	// ex  : [ {"name" : "Leo" , "post_count" : 99 } , 
	//		   {"name" : "Apple" , "post_count" : 20 } ,
	//		   {"name" : "Jeff" , "post_count" : 18 } , ...]
	
	var temp = [];

	
	for(var key in dict){

		temp[temp.length] = {
			"name" : key ,
			"post_count" : dict[key]
		} ;
		
	}

	temp.sort(function(a,b){
		return -(a["post_count"] - b["post_count"]) ; 
	});
	
	return temp ;
}

function sorting_time(dict_grouptime){
	
	// In  : dict
	// ex  :  { '2015-01-01': {...} , "2015-01-02":{...} , ...}

	// Out : Sorted list 
	// ex  : [ {"time" : "2015-01-01" , "element" : {...} } , 
	//		   {"time" : "2015-01-02" , "element" : {...} } ,
	//		   {"time" : "2015-01-03" , "element" : {...} } , ...]
	
	var temp = [];
	
	for(var key in dict_grouptime){

		temp[temp.length] = {
			"time" : key ,
			"element" : dict_grouptime[key]
		} ;
		
	}
	
	temp.sort(function(a,b){
		return -(new Date(a["time"]) - new Date(b["time"]) );
	});
	
	return temp ; 
}

function genList_show_list(list_grouptime){
	$('.Post_list').html();
	
	var content = '' ;

	for(var index in list_grouptime){
		var posts  = list_grouptime[index]["element"]['posts'] , 
			time   = list_grouptime[index]["time"] ;

		// time 應該不用加 class
		content += '<span class = "' + time +'">' + time + '</span><br>';
	

		for(var ele in posts){
			var title = posts[ele]["title"],
				url   = posts[ele]["url"] ,
				author_class = posts[ele]["author"].split(" ").join("_") + "_post";
				content += '<a href = "'+ url + '" target = "_blank" class = "' + author_class + '">' + title + '</a><br>';
		}
		

		content += '=============================================================================================<br>' ;
	}
	
	$('.Post_list').html(content);
	
	content = null  ;
}

function genList_show_author(list_author , num) {
	
	$('.AuthorTop10').html('');
	
	var heroes = '意見領袖們: <br>' ;
	
	var number = (list_author.length >= num) ? num : list_author.length;
	
	for(var i = 0 ; i < number ; i++){
			heroes += '<span style="cursor : pointer;">' + list_author[i]['name'] + ' , ' + list_author[i]['post_count'] + '</span><br>';
	}
	
	$('.AuthorTop10').html(heroes);
	
	heroes = null ;
	
	
}


// If hero is clicked , then we highlight his articles 
function hight_light_list(){
	
	$('.Post_list > a').removeClass('showWebaby');
	$('.AuthorTop10 > span').removeClass('showWebaby');

	var author =  '.' + $(this).text().split(',')[0].trim().split(" ").join("_") + '_post';
		author = author.replace("(","\\(").replace(")","\\)");
	
	$(author).addClass('showWebaby');
	$(this).addClass('showWebaby');
}

// If bar is clicked , then the list scroll to that day
function catch_me_if_you_can(ele){
	
	// This is a math question
	// Now we know :
	// 		day_position + scrollBar_position = K (constant)
	// Wanna :
	// 		day_position = textArea_absolute_position = 560
	// 1st :
	//		get the K value  (day + scrollBar_position)
	// 2nd :
	//      get the textArea_absolute_position , let it equal to day_position
	// 3rd :
	//	 	we can find out scrollBar_position
	// 4th :
	//		use jQuery scroll to that position.
	
	var day = '.' + ele.target.__data__["x"];
	var day_position = $(day).position()["top"];
	var total = day_position + $('.Post_list').scrollTop();
	
	var expect_value = $(".Post_list").position()["top"] + 5 ; 
	
	var bar_position = total - expect_value ; 
	
	$(".Post_list").scrollTop(bar_position);

	
}

//  genChart : turn data into exact format
function genChart_data(dict){
	// Format :
	// [
	//	 { "key" : "group_name" , 
	//	   "values" : [ { x : '' , y : ''} , 
	//					{ x : "" , y : ''} , ...
	//				  ]
	//	 } , {...} , {...} , ...
	// ]
	
	
	var final_list = [ { 
			"key" : "Post Numbers" , 
			"values" : [] 
		}];
	
	for(var time in dict){
		final_list[0]["values"].push({
			x : time , 
			y : dict[time]["post_count"]
		}) ;
	}
	
	return final_list ; 
}

//  genChart : Yap , generate Chart. 
function genChart_index3(data){

	d3.selectAll('.Index3_Chart svg').selectAll('*').remove();
	d3.selectAll('.Index3_Chart').selectAll('.nvtooltip').remove();
	// d3.selectAll('.StackedAreaChart').selectAll('.nvtooltip').remove();
	
	var colors = ['#FF88C2','#FFDD55','#0044BB','#00AA00','#7A0099',
					'#E63F00','#EE7700','#E63F00','#DDAA00','#0000AA','#99FF99',
					'#33FFDD','#7744FF','#A42D00','#CC0000']
	
	var random_num = Math.round(Math.random()*15) ; 
		
	var chart ; 
	nv.addGraph(function() {
		
		
		chart = nv.models.multiBarChart()
		  // .transitionDuration(350)
		  .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
		  .rotateLabels(0)      //Angle to rotate x-axis labels.
		  .showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
		  .groupSpacing(0.1)    //Distance between each group of bars.
		  
		;

	
		chart.xAxis
			 .tickFormat(function(d){
				return d3.time.format('%Y-%m-%d')(new Date(d)); 
			 });
		

		chart.yAxis
			.tickFormat(d3.format('d'));
			
		
			
		chart.barColor([colors[random_num]]);

		d3.select('#chart_postNumbers svg')
			.datum(data)
			.transition().duration(1000)
			.call(chart);
			
			
		// If this chart appeared , we need to refresh this chart one time.
		$('.topic_content[show_chart_QQ*="Index3"]').one("click",function(){
			chart.update();
		})
		
		nv.utils.windowResize(chart.update);
		
		return chart;
	} ,	function(chart){   // This is callback function , we have to write here.
		$('.nv-bar').click(catch_me_if_you_can);
	
	});

}


