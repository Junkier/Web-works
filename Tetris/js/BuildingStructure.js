block_num = 0 ;
row = 15;
column = 12;
// static: 10px
// active: 20px
// locked: 0px

function doFirst(){
	
	$('#startbutton').remove();
	$('#startScript').remove();
	$('section').before('<textarea class="board" id = "showLevel" >showLevel</textarea>');
	
	for (var line = 1; line <= (row+1) ; line ++){
		if( line < 10){
			line_text = "i0" + line;
		} else{
			line_text = "i" + line;
		}
		
		if (line != (row+1)){
			
			$('section').append('<div class=\'Line' + line + '\'></div>');
		
			for (var j = 1; j <= column ; j++){	 // #Blocki10j13 
				
				if( j < 10){
					j_text = "j0" + j;
				} else{
					j_text = "j" + j;
				}
				
				$('.Line' + line).append('<div class = \'Block\' id = \'Block' + line_text + j_text +'\'></div>');	
				$('.Line' + line).children().last().text(line_text.substring(1,3)+','+ j_text.substring(1,3) );
			}
			
		} else {
			$('section').append('<div class=\'ground\'></div>');
			
			for (var j = 1; j <= column ; j++){	
				if( j < 10){
					j_text = "j0" + j;
				} else{
					j_text = "j" + j;
				}
			
				$('.ground').append('<div class = \'Block\' id = \'Block' + line_text + j_text +'\'></div>');	
				$('.ground').children().last().text('QQ');
			}
			
		}
		
		
	}
	
	
	$('.Block').css({
		'width':'35px',
		'height':'35px',
		'border':'1px solid black',
		'text-align':'center',
		'line-height':'50px',
		'font-size':'10px',
		'float':'left'
	});
				
	
	$('.ground .Block').css({
		'background-color':'#000',
		'font-size':'0px',
	});
	
	$('.mainBlock').css({
	 	/*'width':(37*column)+'px',
		'height':(37*row)+'px', 
		'border':'1px solid black',*/
		'margin':'20px auto',
		'margin-left':'9%'
	}); 
	
	
	$('section').append('<div style=\'clear:both;\'></div>');
	$('aside').append('<div class="board" id = "nextBlock"></div> <div style="clear:both;"></div>');
	$('aside').append('<textarea class="board" id = "score">0</textarea> <div style="clear:both;"></div>');
	$('aside').append('<textarea class="board" id = "music"> music</textarea>');
	
	for (var i = 1 ; i <=12 ; i++){
		
		if( i % 3 ==0){
			$('#nextBlock').append('<div class="nextBlock_sub"></div><div style="clear:both;"></div>');
			
		} else {
			$('#nextBlock').append('<div class="nextBlock_sub"></div>');

		}
		
	
		$('.nextBlock_sub').eq(i-1).attr('id','nextBlock_sub_Block'+i);
	}
	
	$('.MusicPlayer').show();
	musicPlayer();
	blockCode = BuildingBlocks.NewBlock((Math.floor(Math.random()*100) + 1) % 7);
	blockNumber = BuildingBlocks.nextBlock();
	doSecond();
}


var BuildingBlocks = {
	
	NewBlock : function(number){

		switch(number){
			case 0: 	//square
				block1 = $('.Line1').children('#Blocki01j05');
				block2 = $('.Line2').children('#Blocki02j05');
				active = {'background-color':'#fa2','font-size':'20px'};
				block1.nextUntil('#Blocki01j08').css(active);
				block2.nextUntil('#Blocki02j08').css(active);
				break;
			case 1:		//Left_L
				block1 = $('.Line1').children('#Blocki01j05');
				block2 = $('.Line2').children('#Blocki02j06');
				active = {'background-color':'#fa2','font-size':'20px'};
				block1.nextUntil('#Blocki01j09').css(active);
				block2.css(active);
				break;
			case 2:		//Right_L
				block1 = $('.Line1').children('#Blocki01j04');
				block2 = $('.Line2').children('#Blocki02j07');
				active = {'background-color':'#fa2','font-size':'20px'};
				block1.nextUntil('#Blocki01j08').css(active);
				block2.css(active);
				break;
			case 3:		// Line
				block1 = $('.Line1').children('#Blocki01j04');			
				active = {'background-color':'#fa2','font-size':'20px'}
				block1.nextUntil('#Blocki01j09').css(active);
				break;
			case 4:		// Left_N
				block1 = $('.Line1').children('#Blocki01j05');
				block2 = $('.Line2').children('#Blocki02j06');
				active = {'background-color':'#fa2','font-size':'20px'};
				block1.nextUntil('#Blocki01j08').css(active);
				block2.nextUntil('#Blocki02j09').css(active);
				break;
			case 5:		// Right_N
				block1 = $('.Line1').children('#Blocki01j05');
				block2 = $('.Line2').children('#Blocki02j04');
				active = {'background-color':'#fa2','font-size':'20px'};
				block1.nextUntil('#Blocki01j08').css(active);
				block2.nextUntil('#Blocki02j07').css(active);
				break;
			case 6:		// T-span
				block1 = $('.Line1').children('#Blocki01j05');
				block2 = $('.Line2').children('#Blocki02j07');
				active = {'background-color':'#fa2','font-size':'20px'};
				block1.nextUntil('#Blocki01j09').css(active);
				block2.css(active);
				break;
			
		}
		
		return {'block_num':block_num,'number':number};
	} ,
	
	
	nextBlock : function(){
		
		$('.nextBlock_sub').css('background-color','#fff');
		
		var number = (Math.floor(Math.random()*100) + 1) % 7 ;
		var active = {'background-color':'#fa2','font-size':'20px'} ;
		switch(number){
			case 0: 	//square
				$('#nextBlock_sub_Block5').css(active);	
				$('#nextBlock_sub_Block6').css(active);	
				$('#nextBlock_sub_Block8').css(active);	
				$('#nextBlock_sub_Block9').css(active);	
				break;
			case 1:		//Left_L
				$('#nextBlock_sub_Block2').css(active);	
				$('#nextBlock_sub_Block5').css(active);	
				$('#nextBlock_sub_Block8').css(active);	
				$('#nextBlock_sub_Block9').css(active);	
				break;
			case 2:		//Right_L
				$('#nextBlock_sub_Block2').css(active);	
				$('#nextBlock_sub_Block5').css(active);	
				$('#nextBlock_sub_Block8').css(active);	
				$('#nextBlock_sub_Block7').css(active);	
				break;
			case 3:		// Line
				$('#nextBlock_sub_Block2').css(active);	
				$('#nextBlock_sub_Block5').css(active);	
				$('#nextBlock_sub_Block8').css(active);	
				$('#nextBlock_sub_Block11').css(active);	
				break;
			case 4:		// Left_N
				$('#nextBlock_sub_Block5').css(active);	
				$('#nextBlock_sub_Block6').css(active);	
				$('#nextBlock_sub_Block7').css(active);	
				$('#nextBlock_sub_Block8').css(active);	
				break;
			case 5:		// Right_N
				$('#nextBlock_sub_Block4').css(active);	
				$('#nextBlock_sub_Block5').css(active);	
				$('#nextBlock_sub_Block8').css(active);	
				$('#nextBlock_sub_Block9').css(active);	
				break;
			case 6:		// T-span
				$('#nextBlock_sub_Block5').css(active);	
				$('#nextBlock_sub_Block7').css(active);	
				$('#nextBlock_sub_Block8').css(active);	
				$('#nextBlock_sub_Block9').css(active);	
				break;
			
		}
		
		return number;

		
	}
}






