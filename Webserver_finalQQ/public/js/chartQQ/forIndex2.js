function index2Aggr(data){

	// #input data into this function to fix raw data.
	fixingFunc(data);

	var bigDict = {};

	for(index in data){
		var wordCount = data[index]["_source"]["content_wordcount"];
		for(i in wordCount){
			var pair = wordCount[i];
			if(pair["word"] in bigDict){
				bigDict[pair["word"]] +=  pair["count"];
			}else{
				bigDict[pair["word"]] = pair["count"];
			}
		}
	}

	 index2Sorting(bigDict);
}



function index2Sorting(data){
	var sort_ary = [];
	for(index in data){
		sort_ary.push([index, data[index]]);
	}
	sort_ary.sort(function(a, b){ return b[1] - a[1] });
	var sorted_data = sort_ary.slice(0,20);

	drawIndex2(sorted_data);
}



// This function is that draw top10 bar-chart.
function drawIndex2(data){
	$('#topWord').highcharts({
		chart: {
			type: 'column'
		},
		title: {
			text: 'Top 20 熱門字詞'
		},
		// subtitle: {
		// 	text: 'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
		// },
		xAxis: {
			type: 'category',
			labels: {
				rotation: -45,
				style: {
					fontSize: '16px',
					fontFamily: 'Verdana, sans-serif'
				}
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: '頻率',
				rotation: 0,
				style:{
					fontSize: '16px',
					fontFamily: 'Verdana, sans-serif'
				}
			}
		},
		legend: {
			enabled: false
		},
		tooltip: {
			pointFormat: '頻率 ： <b>{point.y:.0f} 次</b>'
		},
		series: [{
			name: 'Population',
			data: data,
			dataLabels: {
				enabled: true,
				rotation: 0,
				color: '#FFFFFF',
				align: 'right',
				format: '{point.y:.0f}', // one decimal // #'{point.y:.1f}'小數點後第1位
				y: 10, // 10 pixels down from the top
				style: {
					fontSize: '13px',
					fontFamily: 'Verdana, sans-serif'
				}
			}
		}]
	});
}



// # Function of fixing data type
function fixingFunc(data){
	var bigdata = {};
	var bigAry = [];

	for(curser in data){
		var obj = data[curser];
		var post_time = obj["_source"]["time"];
		var post_title = obj["_source"]["title"];
		var post_field = obj["_source"]["field"];
		var post_source = obj["_source"]["source"];
		var post_author = obj["_source"]["author"];
		var post_vol = obj["_source"]["new_vol"];
		var post_url = obj["_source"]["url"];
		var post_response = obj["_source"]["responses"];

		// console.log(post_time, post_title, post_field, post_source, post_author, post_vol, post_url);

		bigdata['post_time'] = post_time;
		bigdata['post_title'] = post_title;
		bigdata['post_author'] = post_author;
		bigdata['post_source'] = post_source;
		bigdata['post_vol'] = post_vol;
		bigdata['post_field'] = post_field;
		bigdata['post_url'] = post_url;
		bigdata['post_response'] = post_response
		bigAry.push(bigdata);
		bigdata = {};
	}

	bigAry.sort(function(a, b){ return b.post_vol - a.post_vol });
	// console.log(bigAry);

	// #Try to get top5 article
	var hotData = bigAry.slice(0,5);
	// console.log(hotData);

	fixingFunc2(hotData);

	// Input data to this function making table.
	// makeTable(hotData);
}



function fixingFunc2(data){
	var objQQ = {
		"post_author":"--",
		"post_field":"--",
		"post_source":"--",
		"post_time":"--",
		"post_title":"--",
		"post_url":"--",
		"post_vol":"--",
		"post_response":"--"
	}
	var column_num = data.length;
	
    if(column_num < 5){
    	QQnum = (5-column_num);
    	for(var i = 1; i <= QQnum ; i++){
    		data.push(objQQ);
    	}
    	makeTable(data);
    }else{
    	makeTable(data);
    };
}



function makeTable(data){
	//console.log(data);
	//var data_len = (data.length >= 5) ? 5 : data.length ;
	var data_len = data.length;
	var content = "<table>"+
					"<tr id='thead'>"+
						"<th class='thcell'>排名</th>"+
						"<th class='thcell'>時間</th>"+
						"<th class='thcell'>標題</th>"+
						"<th class='thcell'>作者</th>"+
						"<th class='thcell'>來源</th>"+
						"<th class='thcell'>回文數</th>"+
						"<th class='thcell'>聲量</th>"+
						"<th class='thcell'>陣地</th>"+
					"</tr>";
	for (var i = 0 ; i < data_len ; i ++){
		if(i == 0){
			content += "<tr class='thbody_row'>";
		} else {
			content += "<tr>";
		}
			content += 		"<td class='tdcell'>No." + (i+1) +"</td>"+
							"<td class='tdcell'>"+ data[i]["post_time"].split(' ')[0] +"</td>"+
							"<td class='tdcell'><a href='"+ data[i]["post_url"] +"' target='_blank'>"+ data[i]["post_title"] +"</a></td>"+
							"<td class='tdcell'>"+ data[i]["post_author"]+"</td>"+
							"<td class='tdcell'>"+ data[i]["post_source"]+"</td>"+
							"<td class='tdcell'>"+ data[i]["post_response"]+"</td>"+
							"<td class='tdcell'>"+ data[i]["post_vol"]+"</td>"+
							"<td class='tdcell'>"+ data[i]["post_field"]+"</td>"+
						"</tr>";	
	}
	
	content += "</table>" ;
	
	$("#rankingTable").html(content);
	
	content = null ;
	
}



