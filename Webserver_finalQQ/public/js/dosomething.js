$(function(){
	
	// Don't set host ip
	var server_url = '/soap/testQQ';
	
	Iam_Ajax_not_Francis(server_url);

	Time_Picker();

	var field_sum_dict = List_Add_All();
	
	Select_All_Guys(field_sum_dict);
	
	OtherThings();
	
	console.log($(window).attr('height'));
});

function Iam_Ajax_not_Francis(urlQQ){
	
	var input_time_format  = "YYYY年MM月DD日" ,
		output_time_format = "YYYY-MM-DD";

	$('#submitQQ').click(function(){
		

		var	query_data = {
			keyword : $("input[name='keyword']").val() ,
			start_time : moment( $("input[name='start_time']").val() , input_time_format ).format(output_time_format),
			end_time : moment( $("input[name='end_time']").val() , input_time_format ).format(output_time_format),
			index_source : $("input:checked").parents().siblings('select').map(function(){ 
				return $(this).attr('id').split("-")[0] ; 
			}).get() ,
			type_source : $("input:checked").map(function(){
				return $(this).parents('li').attr("class").split(' ')[0];
			}).get()
		};
		// console.log(query_data);
		  $.ajax({
			url : urlQQ ,
			data : query_data,
			type : "POST",
			dataType:"json" ,   // 預期 Server 傳回的 data type  
		    success: function(data){
				
				// For Split version
				index1Aggr(data["post"]);
				index2Aggr(data["post"]);
				index3QQ(data["post"]);
				index4_sourceQQ(data["post"]);
				index6KK(data["post"]);
				index7QQ(data);
				index8QQ(data);
				// For DataBase merged version
				// index1Aggr(data);
				// index2Aggr(data);
				// index3QQ(data);
				// index4_sourceQQ(data);
				
				
				showChart();
			} ,
			timeout : 10000 , 
			// [index1Aggr,index2Aggr, index3QQ ,index4_sourceQQ , showChart], //function(data){console.log(data);},//
			error : function(){
				$('#showWord_OK').text('Abandon search!!!!!');
			}, 
			complete : function(){
				// alert("We're done.");
			} 
			
		}); 
		
	});
	
}

function OtherThings(){
	
	// Switch Charts show or hide . 
	$('.topic_content').click(function(){
		$('.topic_content').removeClass('you_got_this');
		$(this).addClass('you_got_this');
	});
	
	$('.time_content').click(function(){
		$('.time_content').removeClass('you_got_this');
		$(this).addClass('you_got_this');
	});
	
	// Show easy tooltip for searching.
	$('#user_word_here').one('focus',function(e){

		var tooltipHTML = "<div id='show_one_time' class='HeyHey' style='position:fixed; z-index:2000;'>\
				[小提醒] : 查詢多個關鍵字，以空白隔開<br>\
				Ex : 小米  台哥大  亞太\
				</div>"

		$(this).after(tooltipHTML);
		$('#show_one_time').css({
			"border" : "5px solid #C7EDCC",
			"color":"#1190d5",
			"font":"normal 12px Tahoma",
			"backgroundColor":"#C7EDCC",
			"top" : ($(this).height()+80) + "px",
			"left" : ($(this).width()/10) + "px",
			"border-radius": "10px"
		});
		$('#show_one_time').fadeOut(5500);

	}).one('blur',function(e){
		$("#show_one_time").remove();
	});
	
}

function showChart(){
	//$('#showWord_OK').show();
	$('#showWord_OK').show().text('OK!!!!');
	
	

	$('.topic_content').click(function(){
		$('#showWord_OK').hide();
		var chart = $(this).attr("show_Chart_QQ")
						   .split(" ")
						   .map(function(word){ return '.' + word + '_Chart' ; })
						   .join();
	
		$('div[class*="Index"]').css('display',"none");
		$(chart).css('display',"block");
		
		// HighChart reflow only work here.  =.=
		$('#chart_8_QQ').highcharts().reflow();
		$('#topWord').highcharts().reflow();

	});
}

function Time_Picker(){
	// 時間選取器
	$('#start_timeQQ').datetimepicker({
		format : 'LL' ,  // time Format based on what u want.
		minDate : new Date('2015-08-31')
	});
	
    $('#end_timeQQ').datetimepicker({
		format : 'LL',
		useCurrent: false //Important! See issue #1075
    });
    $("#start_timeQQ").on("dp.change", function (e) {
        $('#end_timeQQ').data("DateTimePicker").minDate(e.date);
    });
	$("#end_timeQQ").on("dp.change", function (e) {
		$('#start_timeQQ').data("DateTimePicker").maxDate(e.date);
	});
	
	
}

function List_Add_All(){
	 
	//數量加總
	// Class Add on options . 
	
	//社群(social_media)
	var facebook = 1421;  // added.
	var instagam = 0;
	var youtube = 0;
	var twitter = 0;
	var plurk = 0;
	var ssum = facebook+instagam+youtube+twitter+plurk;

    $("select#social_media-nonSelectedText").html(
        '<option value="1" class = "FB_post">FACEBOOK <span class="countnum">['+facebook+']</span></option>'
        // '<option value="2">INSTAGRAM <span class="countnum">['+instagam+']</span></option>'+
        // '<option value="2">YOUTUBE <span class="countnum">['+youtube+']</span></option>'+
        // '<option value="4">TWITTER <span class="countnum">['+twitter+']</span></option>'+
        // '<option value="5">PLURK <span class="countnum">['+plurk+']</span></option>'
    );

	//論壇(forum)
	var yahoo = 0;
	var lineq = 0;
	var ptt = 444;				// added.
	var mobile01 = 3782;		// added.
	var fashionguide = 0;
	var gounboxing = 0;
	var myshare = 0;
	var eprice = 0;
	var sogi = 0;
	var myav = 0;
	var pcdvd = 0;
	var pczone = 0;
	var ucar = 0;
	var gamer = 0;
	var jorsindo = 0;
	var eyny = 123;				// added.
	var Dcard = 96 ;  			// added.
	var Ck101 = 100 ;           // added/
	var fsum = yahoo+lineq+ptt+mobile01+fashionguide+gounboxing+
	myshare+eprice+sogi+myav+pcdvd+pczone+ucar+gamer+jorsindo+eyny+Dcard + Ck101;

    $("select#forum-nonSelectedText").html(
        // '<option value="1">奇摩知識+ <span class="countnum">['+yahoo+']</span></option>'+
        // '<option value="2">LINE Q <span class="countnum">['+lineq+']</span></option>'+
        '<option value="3" class = "Ptt_post">PTT <span class="countnum">['+ptt+']</span></option>'+
        '<option value="4" class = "Mobile01_post">Mobile01 <span class="countnum">['+mobile01+']</span></option>'+
        // '<option value="5">FashionGuide <span class="countnum">['+fashionguide+']</span></option>'+
        // '<option value="6">卡提諾 <span class="countnum">['+ck101+']</span></option>'+
        // '<option value="7">開箱王 <span class="countnum">['+gounboxing+']</span></option>'+
        // '<option value="8">八大資訊平台 <span class="countnum">['+myshare+']</span></option>'+
        // '<option value="9">ePrice <span class="countnum">['+eprice+']</span></option>'+
        // '<option value="10">手機王 <span class="countnum">['+sogi+']</span></option>'+
        // '<option value="11">ＭyAV視聽商情網 <span class="countnum">['+myav+']</span></option>'+
        // '<option value="12">PCDVD <span class="countnum">['+pcdvd+']</span></option>'+
        // '<option value="13">PCZONE <span class="countnum">['+pczone+']</span></option>'+
        // '<option value="14">U-CAR <span class="countnum">['+ucar+']</span></option>'+
        // '<option value="15">巴哈姆特 <span class="countnum">['+gamer+']</span></option>'+
        // '<option value="16">小老婆汽機車資訊網 <span class="countnum">['+jorsindo+']</span></option>'+
        '<option value="17" class = "Eyny_post">伊莉討論區 <span class="countnum">['+eyny+']</span></option>' +
		'<option value="18" class = "Dcard_post">Dcard <span class="countnum">['+Dcard+']</span></option>' +
		'<option value="19" class = "Ck101_post">Ck101 <span class="countnum">['+Ck101+']</span></option>' 
    );
			
		
			
				
	//新聞(news)
	var udn = 0;			
	var chinatimes = 0;
	var ltn = 0;
	var appledaily = 972;		// added.
	var nownews = 0;
	var cna = 0;
	var ettoday = 2323;
	var setn = 7874;			// added.
	var tvbs = 0;
	var newsyahoo = 0;
	var pchomenews = 0;
	var sinanews = 0;
	var cnyes = 0;
	var techbang = 0;
	var nextmag = 0;
	var nsum = udn+chinatimes+ltn+appledaily+nownews+cna+ettoday+setn+tvbs+newsyahoo+pchomenews+sinanews+cnyes+techbang+nextmag;

	$("select#news-nonSelectedText").html(
        // '<option value="1" >聯合新聞網 <span class="countnum">['+udn+']</span></option>'+
        // '<option value="2">中時電子報 <span class="countnum">['+chinatimes+']</span></option>'+
        // '<option value="3">自由電子報 <span class="countnum">['+ltn+']</span></option>'+
        '<option value="4" class="Applenews_post">蘋果日報 <span class="countnum">['+appledaily+']</span></option>'+
        // '<option value="5">Nownews <span class="countnum">['+nownews+']</span></option>'+
        // '<option value="6">中央新聞網 <span class="countnum">['+cna+']</span></option>'+
        '<option value="7" class = "Ettoday_post">東森新聞雲 <span class="countnum">['+ettoday+']</span></option>'+
        '<option value="8" class = "setn_post">三立新聞網 <span class="countnum">['+setn+']</span></option>'
        // '<option value="9">TVBS新聞 <span class="countnum">['+tvbs+']</span></option>'+
        // '<option value="10">奇摩新聞 <span class="countnum">['+newsyahoo+']</span></option>'+
        // '<option value="11">Pchome新聞 <span class="countnum">['+pchomenews+']</span></option>'+
        // '<option value="12">新浪新聞 <span class="countnum">['+sinanews+']</span></option>'+
        // '<option value="13">鉅亨網 <span class="countnum">['+cnyes+']</span></option>'+
        // '<option value="14">T客幫 <span class="countnum">['+techbang+']</span></option>'+
        // '<option value="15">壹週刊 <span class="countnum">['+nextmag+']</span></option>'
    );
				
	//部落格(blog)
	var pixnet = 21;
	var xuite = 0;
	var blogger = 0;
	var roodo = 0;
	var udnblog = 0;
	var sinablog = 0;
	var bsum = pixnet+xuite+blogger+roodo+udnblog+sinablog;

	 $("select#blog-nonSelectedText").html(
			'<option value="1" class = "Pixnet_post">痞客幫 <span class="countnum">['+pixnet+']</span></option>'
			// '<option value="2">隨意窩 <span class="countnum">['+xuite+']</span></option>'+
			// '<option value="3">Blogger <span class="countnum">['+blogger+']</span></option>'+
			// '<option value="4">樂多 <span class="countnum">['+roodo+']</span></option>'+
			// '<option value="5">UDN Blog <span class="countnum">['+udnblog+']</span></option>'+
			// '<option value="6">新浪部落 <span class="countnum">['+sinablog+']</span></option>'
	);
		
	return {"ssum":ssum , "fsum":fsum , "nsum":nsum , "bsum":bsum } ; 
}

function Select_All_Guys(sums){
	
	// 多選功能

	$('#social_media-nonSelectedText').multiselect( { nonSelectedText: '社群 '+'['+sums.ssum+'] ' } );
    $('#forum-nonSelectedText').multiselect(  { nonSelectedText: '論壇 '+'['+sums.fsum+'] ' } );
	$('#news-nonSelectedText').multiselect(   { nonSelectedText: '新聞 '+'['+sums.nsum+'] ' } );
    $('#blog-nonSelectedText').multiselect(   { nonSelectedText: '部落格 '+'['+sums.bsum+'] ' });
   
    $('#selectAll-all').on('click', function() {
        var open = ($('#selectAll-all').parent().attr("class"));
		
		if(open == "btn-group"){
			$('#social_media-nonSelectedText,#forum-nonSelectedText,#news-nonSelectedText,#blog-nonSelectedText').multiselect('selectAll', false);
			$('#social_media-nonSelectedText,#forum-nonSelectedText,#news-nonSelectedText,#blog-nonSelectedText').multiselect('updateButtonText');
			$('#selectAll-all').parent().addClass("#isopen");
			$(this).text('取消');
			// var ss = $('.qq label').text();
			// console.log(ss);
		}else{
			$('#social_media-nonSelectedText,#forum-nonSelectedText,#news-nonSelectedText,#blog-nonSelectedText').multiselect('deselectAll', false);
			$('#social_media-nonSelectedText,#forum-nonSelectedText,#news-nonSelectedText,#blog-nonSelectedText').multiselect('updateButtonText');
			$('#selectAll-all').parent().removeClass("#isopen");
			$(this).text('全選');
		}
    });

}

