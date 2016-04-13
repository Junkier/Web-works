function index8QQ(data){

	var time_list = genGroup_index8(false);
	var time_group = time_list[0] ,
		time_mode  = time_list[1] ;
		
	var data_post = data["post"] ;
	
	// Gen a dict for response mapping to post time.
	var time_mapping_res_and_post = {} ;
	
	var data_res  = data["response"];
	
	// Counting the post number by key (fields_name)
	for(var num in data_post){

		var time  = moment(new Date(data_post[num]["_source"]["time"].split(" ")[0].replace(/-/g,'/'))).format("YYYY-MM-DD"),
			content_semantic_tag = data_post[num]["_source"]["content_semantic_tag"] ,
			new_vol = data_post[num]["_source"]["new_vol"] ,
			_id =  data_post[num]["_id"] ; 
		
		// Then we put the document into "post" list
		time_group[time]["post"].push({
			"new_vol" : new_vol,
			"content_semantic_tag" : content_semantic_tag
		})
		
		time_mapping_res_and_post[_id] = time ; 
		
		time = null , content_semantic_tag = null , new_vol = null  , _id = null ;
		
	}
	

	for(var num in data_res){
		
		var response_document = data_res[num]["_source"]["response"] ; 
		var parent_post = data_res[num]["_source"]["parent_post"];
		
		for (var res_entry_num in response_document){
			
			var res_entry = response_document[res_entry_num];
			var time = time_mapping_res_and_post[parent_post];
			// var time  = moment(new Date(res_entry["time"].split(" ")[0].replace(/-/g,'/'))).format("YYYY-MM-DD"),
				semantic_tag = res_entry["semantic_tag"] ;
			// console.log(time);
			if( time in time_group ){
				time_group[time]["response"].push(semantic_tag);
			}
			
			
			time = null , semantic_tag = null , res_entry = null ;
		}

		response_document = null , parent_post = null ;
	}
	
	var final_group =  convert_to_voice(time_group);
	
	var result_array = [] ;
	
	for(var time in final_group){
		result_array.push( {"time" : time , "voice" : final_group[time] } );
	}

	result_array.sort(function(a,b){
		return new Date(a["time"]) - new Date(b["time"]) ;
	});
	
	var final_time_list = result_array.map(function(data){ return data["time"] }) ;
	var final_total = result_array.map(function(data){ return data["voice"]["total"]}) ;
	var final_pos = result_array.map(function(data){ return data["voice"]["pos"]}) ;
	var final_neg = result_array.map(function(data){ return data["voice"]["neg"]}) ;
	
	genChart_index8(final_time_list,final_pos,final_neg,final_total);
	
	time_group = null
	
}


function genGroup_index8(seperate_type){
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
				"post": [], 
				"response" : []
			} ;
		
		}
		
	} else if (seperate_type && day_diff >=31 && day_diff <= 90){  // By Week
	
		mode = 'Week';
		
		while( start_time <= end_time){
			
			group[encoding_time_to_week(new Date(start_time.format("YYYY-MM-DD")))] = { 
				"post": [] , 
				"response" : []
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
				"post": [] , 
				"response" : []
			} ;
		
		}
	}
	

				
	return [group , mode] ;
	
	
}

function convert_to_voice(time_dict){
	
	var voice_dict = {} ;
	
	for(var time in time_dict){
		
		var total_vol = (time_dict[time]["post"].length == 0 ) ? 0 : time_dict[time]["post"].map(function(data){ return  data["new_vol"] ; })
																						   	  .reduce(function(pre_value,current_value){
																									return pre_value + current_value ;
																							  });
		var pos_vol = 0 ,
			neg_vol = 0 ;

		if( time_dict[time]["response"].length != 0 ){
			
			time_dict[time]["response"].map(function(emotion_tag){
				
				if(emotion_tag == 'pos') {
						pos_vol += 1 ; 
				} else if (emotion_tag == 'neg') {
						neg_vol += 1 ;
				} 
				
				
			});
			
			
		}
		
		if( time_dict[time]["post"].length != 0 ){
			
			
			time_dict[time]["post"].map(function(ele){
				
				var post_emotion_tag = ele["content_semantic_tag"];
				
				if(post_emotion_tag == 'pos') {
						pos_vol += 1 ; 
				} else if (post_emotion_tag == 'neg') {
						neg_vol += 1 ;
				} 
				
				
			});

			
		}
		
		
		voice_dict[time]= {
			"total" : total_vol ,
			"pos" : pos_vol ,
			"neg" : neg_vol
		};		
		
		
	} 
	
	return voice_dict ;
	
}



function genChart_index8(time,pos,neg,total){
	var good = '#E54A4A' , 
		bad  = "#4CD381" , 
		gush_total = "#4682D4";


	$('#chart_8_QQ').highcharts({

        title: {
            text: '聲量示意圖',
            x: -20 , //center
			style : {
				fontSize : "24px"
			}
        },
        // subtitle: {
        //     text: 'Source: WorldClimate.com',
        //     x: -20
        // },
        xAxis: {
            categories : time,    // list'
			tickInterval : 7
            },
        yAxis: {
            title: {
                text: '聲量' ,
				style : {
					fontSize : "24px"
				}
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        // tooltip: {
        //     valueSuffix: ' '
        // },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0 ,
			itemStyle: {
                 // fontSize:'50px',
                 font: '20px Trebuchet MS, Verdana, sans-serif'
              
             },
        },
        series: [{
            name: '正評聲量',
            data: pos ,  // list
			color : good
        }, {
            name: '負評聲量',
            data: neg ,  // list
			color : bad
        }, {
            name: ' 總 聲量',
            data: total , // list
			color : gush_total
        }]
    });
	

}