function index1Aggr(data){
	// console.log(data);
	var bigDict = {};
	if(data.length != 0){
		for(var obj in data){
			var wordCount = data[obj]["_source"]["content_wordcount"];

			for(indices in wordCount){
				var wordCountPair = wordCount[indices];
				
				if(wordCountPair["word"] in bigDict){
					var bigDict_value = wordCountPair["word"];
					bigDict[bigDict_value] += wordCountPair["count"];
				}else{
					bigDict[wordCountPair["word"]] = wordCountPair["count"];
				}
			}	
		}

	}
	var result_data = index1Fixing(bigDict);

	index1Draw(result_data.slice(0, 50));
}



function index1Fixing(data){
	var wordCount_cloud = [];

	for(Phrase in data){
		var phrase_dict = {};
		phrase_dict["text"] = Phrase;
		phrase_dict["weight"] = data[Phrase];
		wordCount_cloud.push(phrase_dict);
	}

	return index1Sorting(wordCount_cloud)
}



function index1Sorting(data){
	var result = data.sort(function(a,b) {
	    return b.count - a.count;
	});

	return result
}



function index1Draw(data){
	if($(".Index1_Chart > span").length < 1){
		$('.Index1_Chart').jQCloud(data, {
            steps:6,
            classPattern: 'w{n}',
            colors: ['#F00000', '#A830FF', '#00C200', '#1212FF', '#fa2', '#B0B0B0'],
            fontSize: {from: 0.1, to: 0.03},
            delay: 10    //文字雲中文字出現時間
    	});
	}else{
		$('.Index1_Chart').jQCloud(data, {
            steps:6,
            classPattern: 'w{n}',
            colors: ['#F00000', '#A830FF', '#00C200', '#1212FF', '#fa2', '#B0B0B0'],
            fontSize: {from: 0.1, to: 0.03},
            delay: 10    //文字雲中文字出現時間
    	});
    	$('.Index1_Chart').jQCloud('update', data);
	
	}
    $('#update-demo').on('click', function() {
        data.splice(-3);
        $('.Index1_Chart').jQCloud('update', data);
    });
}


