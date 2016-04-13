function index7QQ(data){
    // console.log(data);
	var good_group = genGroup_Index7('sources');
	
	var data_post = data["post"] ;
	var data_res  = data["response"];
	
	for(var num in data_post){

		var source  = data_post[num]["_type"].split("_")[0] , 
			content_semantic_tag = data_post[num]["_source"]["content_semantic_tag"] ,
			title = data_post[num]["_source"]["title"],
			url = data_post[num]["_source"]["url"],
			content_semantic_score = data_post[num]["_source"]["content_semantic_score"],
			new_vol =  data_post[num]["_source"]["new_vol"];
			
			if (content_semantic_tag == 'neu'){
				good_group[source]["post"][content_semantic_tag] += 1 ;
				
			} else {
				good_group[source]["post"][content_semantic_tag]["voice"] += 1 ;
				good_group[source]["post"][content_semantic_tag]["element"].push({
					"title" : title,
					"url" : url,
					"content_semantic_score" : content_semantic_score, 
					"new_vol" : new_vol
				});
			}
		
		source = null , content_semantic_tag = null , content_semantic_score = null , title = null , new_vol = null  , url = null ;
	}
	
	for(var num in data_res){

		var source  = data_res[num]["_type"].split("_")[0] , 
			response_entry = data_res[num]["_source"]["response"] ;
			
		response_entry.map(function(ele){
			good_group[source]["response"][ele["semantic_tag"]] += 1;
		});
			
		source = null , response_entry = null ;
	}
	
	for(var key in good_group){
		good_group[key]["post"]["total_ele_number"] = good_group[key]["post"]["neu"] + 
													  good_group[key]["post"]["pos"]["voice"] + 
													  good_group[key]["post"]["neg"]["voice"] ;
													  
		good_group[key]["response"]["total_ele_number"] = good_group[key]["response"]["neu"] + 
													  good_group[key]["response"]["pos"] + 
													  good_group[key]["response"]["neg"] ;											  										  
	}
	
	// It's a global variable , a function. 
	binding_index6_and_index7_finalQQ = function(use_web_site){
		// For Captain American
		genChart_Index7(use_web_site , good_group[use_web_site] , 'chart_7_CaptainAmerican');
		
		// For Iron Man & Iron Woman
		
		var sorting_post_pos = good_group[use_web_site]["post"]["pos"]["element"].sort(function(a,b){
			return -( a["content_semantic_score"] - b["content_semantic_score"] ); 
		})
		
		var sorting_post_neg = good_group[use_web_site]["post"]["neg"]["element"].sort(function(a,b){
			return  a["content_semantic_score"] - b["content_semantic_score"]  ; 
		})
		
		genTable_Index7(sorting_post_pos , "#chart_7_IronMan");
		genTable_Index7(sorting_post_neg , "#chart_7_IronWoman");
		
		sorting_post_pos = null , sorting_post_neg = null ;
	};
	
	
}


 
function genGroup_Index7(type){
	
	if (type == 'indices'){
		// By Fields
		var key_names = $("input:checked").parents().siblings('select').map(function(){ 
				return $(this).attr('id').split("-")[0] ; 
			}).get();


	} else {
		// By Sources
		var key_names = $("input:checked").map(function(){
				return $(this).parents('li').attr("class").split('_')[0];
			}).get();
			
	}
	
	
	var group = {};

	for(var name in key_names){

		group[key_names[name]] = {
			"post" : { 
						"neu" : 0 ,
						"pos" : {
							"voice" : 0 ,
							"element" : []
						},
						"neg" : {
							"voice" : 0 ,
							"element" : []
						},
						"total_ele_number" : 0
						} , 
			"response" : {
						"neu" : 0 ,
						"pos" : 0 ,
						"neg" : 0 , 
						"total_ele_number" : 0
			}
		};
	
	}
	
	return group ;
}
  
function genChart_Index7(web_site , dataQQ , _id){
	

	// 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(_id));
	var good = '#E54A4A' , 
		bad  = "#4CB381" , 
		stupid_guy = "steelblue",
		label_size = {
						"normal" : {
							"textStyle" : {
								"fontSize" : '18'
							}
						},
						"emphasis" : {
							"textStyle" : {
								"fontSize" : '18'
							}
						}
					};
		
		option = {
            title : {
                text: '正負評價',
				textStyle : {
					fontSize : '30'
				},
                subtext: web_site,//'纯属虚构(誰跟你虛構)',
				subtextStyle : {
					fontSize : '25',
					color :  '#555'
				},
				padding : [20,0,0,0],
                x:'center'
            },
            //tooltip 是用來控制資訊浮層的方法，內有許多參數可以調整改變。
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x : 'center',
                y : 'bottom',
               data:[
				{	name : "正評" ,
					textStyle : {
						color : good
					}
				},
				{	name : "負評" ,
					textStyle : {
						color : bad
					}
				},{	name : "中立" ,
					textStyle : {
						color : stupid_guy
					}
				}]
            },
            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            series : [
                {
                    name:'正文',
                    type:'pie',
                    radius : [25, 110],
                    center : ['25%', 200],
                    roseType : 'radius',
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    lableLine: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    data:[
                        { 	value : dataQQ["post"]["pos"]["voice"]  ,
							name:'正評' , 
							label : label_size ,
							itemStyle : {
								normal : {
									color : good
								}
							} 
							
						},
						{   value : dataQQ["post"]["neg"]["voice"]  , 
							name:'負評' ,
							label : label_size ,
							itemStyle : {
								normal : {
									color : bad
								}
							} 							
						},
                        {   value : dataQQ["post"]["neu"] , 
							name:'中立' ,
							label : label_size ,
							itemStyle : {
								normal : {
									color : stupid_guy
								}
							} 							
						}
                    ]
                },
                {
                    name:'回文',
                    type:'pie',
                    radius : [25, 110],
                    center : ['75%', 200],
                    roseType : 'area',
					data:[
                        { 	value : dataQQ["response"]["pos"]   ,
							name:'正評' , 
							label : label_size ,
							itemStyle : {
								normal : {
									color : good
								}
							} 
						},
						{   value : dataQQ["response"]["neg"]   , 
							name:'負評' ,
							label : label_size ,
							itemStyle : {
								normal : {
									color : bad
								}
							} 							
						},
                        {   value : dataQQ["response"]["neu"]  , 
							name:'中立' ,
							label : label_size ,
							itemStyle : {
								normal : {
									color : stupid_guy
								}
							} 							
						}
                    ]
                }
            ]
        };
		

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
	
		$('.topic_content[show_chart_QQ*="Index7"]').click(function(){
			// echarts is too fast , so we have to wait for 1 ms .
				setTimeout(function(){
					myChart.resize();
				},1);
				
		
		});
	
		$(window).resize(function(){
			myChart.resize();
		});
		
	
}
  

function genTable_Index7(data,_id){
	 
	 var objQQ = {
		"title":"--",
		"content_semantic_score":"--",
		"url":"--",
		"new_vol":"--"
	}
	
    if(data.length < 5){
    	var data_empty_len = (5 - data.length);
	
    	for(var i = 1; i <= data_empty_len ; i++){
    		data.push(objQQ);
    	}
    
    }
	
	
	var data_len = (data.length >= 5) ? 5 : data.length ;
	
	// post_pos ( Iron Man )
	// post_neg ( Iron Woman )
	var content = "<table>"+
					"<tr id='thead'>"+
						"<th class='thcell'>排名</th>"+
						"<th class='thcell'>標題</th>"+
						"<th class='thcell'>評價分數</th>"+
						"<th class='thcell'>人氣</th>"+
					"</tr>";
					
	for (var i = 0 ; i < data_len ; i ++){
		if(i == 0){
			content += "<tr class='thbody_row'>";
		} else {
			content += "<tr>";
		}
			content += 		"<td class='tdcell'>No." + (i+1) +"</td>"+
							"<td class='tdcell'><a href='"+ data[i]["url"] +"' target='_blank'>"+ data[i]["title"] +"</a></td>"+
							"<td class='tdcell'>"+ ((typeof data[i]["content_semantic_score"] == "string") ? '--' : data[i]["content_semantic_score"].toFixed(6))+"</td>"+
							"<td class='tdcell'>"+ data[i]["new_vol"]+"</td>"+
						"</tr>";	
	}
	
	content += "</table>" ;
	
	$(_id).html(content);
	
	content = null ;
	$('.thcell').css('text-align',"center");
}