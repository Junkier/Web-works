var elasticsearch = require("elasticsearch");
// var fs = require('fs');

var client = new elasticsearch.Client({
	// host: 'insighteye.gptt.com.tw:9527/',
	hosts: [ 
		'192.168.142.79:9200/',
		'192.168.142.115:9200/'
	] ,
	// host : '192.168.142.79:9200/',
	log:'info'
	
});

function searchQQ(res_body){

	var fix_end_time = new Date(res_body.end_time) ; 
	
	fix_end_time.setDate(fix_end_time.getDate() + 1) ;
	res_body.end_time = fix_end_time.toISOString().substring(0,10) ; 

	var text_words = res_body.keyword.trim().split(/ +/).map(function(word){ 
			return {
				"match" : { "title" : word}
			};
	});  
	
	var query_post = {
	
		// 果然是 List 跨域吃, 真不愧是 Elastic!!!!
		index: res_body["index_source[]"],  
		type : res_body["type_source[]"] ,
		body : {   
				"query": {
					"bool": {
						"should" : text_words ,
						"must": [
						   { 
								"match": {"title": res_body.keyword }
						   }
						],
						"filter":{
							"range": {
							   "time": {
								  "from": res_body.start_time,
								  "to": res_body.end_time
							   }
							}
						}
					}
				} , 
				"min_score": (text_words.length > 1) ? 0 : 0 ,
				"size": 10000
			}
		
	}; 
	
	// Asynchronous Function Importance.
	// return for_search(query_post);
	return for_search(query_post).then(function(data_post){
		var posts = data_post["hits"]["hits"];
		
		var type_source_fix = (typeof res_body["type_source[]"] == "string") ? [res_body["type_source[]"]] : res_body["type_source[]"] ; 
	
		var posts_ids = posts.map(function(ele){ return ele["_id"] ; }) ;
		
		var query_res = {
		
			index: res_body["index_source[]"] ,  
			type : type_source_fix.map(function(name){ return name.replace("post","response") ; }) ,
			body : {
				// we have to use filter , or it's may too much to show error.
				"filter" : {  
				// "query" : {  
					"terms" : {
						"parent_post" : posts_ids
					}
				} ,
				"size" : 10000
			} 
		}

	
		return for_search(query_res).then(function(data_response){
		
			
			var responses = data_response["hits"]["hits"];
			
			return {"post" : posts , "response" : responses } ;
		} , function (err_response){
			console.log(err_response);
		}) ;
		
		
	}, function (err_post){
			console.log(err_post);
	});
	
	
	
}


function for_search(query){
	return client.search(query);
}


exports.searchQQ = searchQQ;












/*  Delete an existing index  */
// function deleteIndex(){
	// return elasticClient.indices.delete({
		// index: indexName;
	// });
	
// }

// exports.deleteIndex = deleteIndex;

/* Create the index */
// function createIndex(){
	// return elasticClient.indices.create({
		// index : indexName
	// });
// }

// exports.createIndex = createIndex;

/* check if the index exists */
// function indexExists(){
	// return elasticClient.indices.exists({
		// index: indexName
	// });
// }

// exports.indexExists = indexExists;

/* Add Document into Index */
/* Just for exercise */
// function addDocument(document){
	// return elasticClient.index({
		// index : indexName , 
		// type : 'testQQ',
		// body : {
			// title : document.title ,
			// content : document.content
		// }
		
	// });
	
// }

// exports.addDocument = addDocument;



