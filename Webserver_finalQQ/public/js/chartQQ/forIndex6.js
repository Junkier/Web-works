function index6KK(post_data){
    var index6_dict = {};
    var index6_ary = [];
    var web_ary = [];
    var pos_ary = [];
    var neu_ary = [];
    var neg_ary = [];

    for(var i in post_data){
        var semantic_dict = {};
        var website = post_data[i]["_type"].split("_")[0] ;
        var semantic = post_data[i]['_source']['content_semantic_tag'];

        if(website in index6_dict){
            if(semantic in index6_dict[website]){
                index6_dict[website][semantic] += 1;
            }else{
                index6_dict[website][semantic] = 1;
            };
            
        }else{
            semantic_dict[semantic] = 1;
            index6_dict[website] = semantic_dict;
        };

    };
    // console.log(index6_dict);

    for(var i in index6_dict){
        var web = i;
        var pos = index6_dict[i]['pos'];
        var neu = index6_dict[i]['neu'];
        var neg = index6_dict[i]['neg'] * -1;
        web_ary.push(web);
        pos_ary.push(pos);
        neu_ary.push(neu);
        neg_ary.push(neg);
    };
    
	// Total add 
	
    // var sum_pos = pos_ary.reduce(function(a, b) { return a + b; }, 0);
    // var sum_neu = neu_ary.reduce(function(a, b) { return a + b; }, 0);
    // var sum_neg = neg_ary.reduce(function(a, b) { return a + b; }, 0);
    // web_ary.push('Total');
    // pos_ary.push(sum_pos);
    // neu_ary.push(sum_neu);
    // neg_ary.push(sum_neg);
    

    drawIndex6(web_ary,pos_ary,neu_ary,neg_ary);
}



function drawIndex6(web, pos, neu, neg){
		// initialize Index_7_chart
		echarts.init(document.getElementById('chart_7_CaptainAmerican'));
		$("#chart_7_IronMan").html('');
		$("#chart_7_IronWoman").html('');
		
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('emo_count'));
		var good = '#E54A4A' , 
			bad  = "#4CC381" , 
			stupid_guy = "steelblue";

        // 指定图表的配置项和数据
        option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
				top : '10',
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
				//data:['正評', '中立', '負評']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'value'
                }
            ],
            yAxis : [
                {
                    type : 'category',
                    axisTick : {show: false},
                    data : web ,
					axisLabel : {
						textStyle : {
							fontSize : '15'
						}
					}
                }
            ],
            series : [
                {
                    name:'正評',
                    type:'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'right'
                        }
                    },
					itemStyle : {
						normal : {
							color : good
						}
					} ,
                    data:pos
                },
                {
                    name:'負評',
                    type:'bar',
                    stack: '總量',
                    label: {
                        normal: {
                            show: true,
							position: 'left'
                        }
                    },
					itemStyle : {
						normal : {
							color : bad
						}
					} ,
                    data:neg
                },
                {
                    name:'中立',
                    type:'bar',//总量
                    stack: '總量',
                    label: {
                        normal: {
                            show: true,
                            position: 'inside' ,
							textStyle : {
								color : '#eee',
								fontSize : '14'
							}
                        }
                    },
					itemStyle : {
						normal : {
							color : stupid_guy
						}
					} ,
                    data:neu
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
 
		myChart.on('click',function(param){
			if(param["name"] != 'Total'){
				binding_index6_and_index7_finalQQ(param["name"]);
			}
		
		});
		
		$('.topic_content[show_chart_QQ*="Index6"]').click(function(){
		// echarts is too fast , so we have to wait for 1 ms .
				setTimeout(function(){
					myChart.resize();
				},1);

		});
		
	
		$(window).resize(function(){
			myChart.resize();
		});
}
