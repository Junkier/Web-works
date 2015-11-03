// Code  待用 ChangePac 優化
// #Blocki01j04
// 得修正右邊一直退回來的解法
// Tetris2.0 改用 dic list 不抓id
// JRumble.js

function doSecond(){
	myInterval = setInterval(Update,1000,'time');
	
	//$('html').click(clearMyInterval);
	$('html').keydown(changeState);
}

function clearMyInterval(){
	clearInterval(myInterval);
}

function Update(In_mode){
	// Scan which is active Block (V)
	var nowActBlocks = scanActiveBlocks();

	// Get the nextBlocks (V)
	var nextBlocks = getNextBlocks(nowActBlocks,In_mode);

	// Judge next block is Lock or not (act is arrays) (V)
	var result = isBlockLocked(nextBlocks); // T or F
	
	// Update the Statement (V)
	UpdateStatement(result,nowActBlocks,nextBlocks,In_mode);
	
}

function changeState(event){ 	  // 哼哼 
	if (event.which == 37){       // Left (V)
		Update('left');
	} else if(event.which == 39){ // Right (V)
		Update('right');
	} else if(event.which == 40){ // Down (V)
		Update('down');
	} else if(event.which == 38){ // UP (V)
		transform();
	} else if(event.which == 32){ // Space (down rapidly)
		downRapidly();
		
	}
	
	
}

function downRapidly(){
	var nowActBlocks = scanActiveBlocks();
	var nextBlocks = getNextBlocks(nowActBlocks,'down');
	var last_state = nowActBlocks;
	
	while(!isBlockLocked(nextBlocks)){
		last_state = nextBlocks;
		nextBlocks = getNextBlocks(nextBlocks,'down');
	}
	
	setBlocks.Static(nowActBlocks);
	setBlocks.Locked(last_state);
	cleanLine();
	
	blockCode = BuildingBlocks.NewBlock(blockNumber);
	blockNumber = BuildingBlocks.nextBlock();
	
}

function transform(){ // Fighting!!!
	var nowActBlocks = scanActiveBlocks();
	var rotatedBlocks = rotateBlock(nowActBlocks);
	var nextblock = moveBlock(rotatedBlocks);
	setBlocks.Static(nowActBlocks);
	setBlocks.Active(nextblock);
	
}

function rotateBlock(blocks){
	
	var i = changePac.Decompo(blocks)['i'];
	var j = changePac.Decompo(blocks)['j'];
	var center_i = Math.round((i[0]+i[1]+i[2]+i[3])/4.0);
	var center_j = Math.round((j[0]+j[1]+j[2]+j[3])/4.0);
	var len = i.length
	
	for (var num = 0 ; num <len ; num++){
		var new_i = -j[num] + center_j + center_i;
		var new_j = i[num] - center_i + center_j;
		i[num] = new_i;
		j[num] = new_j;
	}
	
	var dic = checkBar(i,j);
	var newblocks = changePac.Compo(dic);

	return newblocks;
}  

function checkBar(row,col){
	var i = row ; 
	var j = col ;
	var len = i.length;
	
	for (var num = 0 ; num <len ; num++){ 
		if (i[num]==0){ // Check Top
			
			for (var k=0 ; k <len ; k++){
				i[k]++;
			}
			
			break;
			
		} else if( i[num] >= (row+1) ){ // Check Button
			
			if (i[num] == (row+1)){
				for (var k=0 ; k <len ; k++){
				i[k]--;
				}
			} else {
				for (var k=0 ; k <len ; k++){
				i[k] -= 2;
				}
			}
			
			break;
			
		} else if(j[num]<=0){ // Check Left
			
			if (j[num]==0){
				for (var k=0 ; k <len ; k++){ 
				j[k]++; 
				}
			} else {
				for (var k=0 ; k <len ; k++){ 
				j[k] += 2; 
				}
			}

			break;
			
		} else if(j[num]==(column+1)){ // Check Right
			for (var k=0 ; k <len ; k++){
				j[k]--;
			}
			break;
		}
	
		
	}
	
	return { 'i' : i , 'j' : j };
}

function moveBlock(blocks){
		
	//var bufferBlocks=blocks;	
	var nextBlocks = blocks;
	//var top_situation = false;	
	var count=0;	
	while(isBlockLocked(nextBlocks)){
		
		if (count <=10){
			var nextBlocks = getNextBlocks(nextBlocks,'up');			
		} else if (count >10 && count <=20){
			var nextBlocks = getNextBlocks(nextBlocks,'left');		
		} else if (count >20 && count <=40){
			var nextBlocks = getNextBlocks(nextBlocks,'right');
		}
		
		var i = changePac.Decompo(nextBlocks)['i'];
		var j = changePac.Decompo(nextBlocks)['j'];
		nextBlocks = changePac.Compo(checkBar(i,j));
		count++;
		if (count >100){
			break;
		}
		
		
	} 
	return nextBlocks;
}

function scanActiveBlocks(){
	
	var actBlock = [];
	
	for(var line =1 ; line <=row; line++){
		for (var j = 1 ; j<=column ; j++){
			var text = '#Block' + NumberToText.i_text(line) + NumberToText.j_text(j) ;
			if($(text).css('font-size') == '20px'){
				actBlock.push(text);
			} 
		}
	}
	return actBlock;
}

function cleanLine(){
	
	var dic = {}
	var total = []
	
	for (var line = 1 ; line <= row ; line ++){
		var num = []
		var count = 0;
		for (var j = 1 ; j <=column ; j++){
			var text = '#Block' + NumberToText.i_text(line) + NumberToText.j_text(j) ;
			if ($(text).css('font-size') == '0px'){
				num.push(1);
				count +=1;
			} else {
				num.push(0);
			}
			
		}
		total.push(count);
		dic[line]=num;
	}
	
	$('#music').text(total);
	
	
	// Clean the lines state
	
	for (var start = row ; start >= 1 ; start--){
		
		
		
		if (total[start-1] == column){
			
			 $('#score').text(parseInt($('#score').text())+ 10) ;
			
			for (var end = start-1 ; end >=1 ; end --){
				
				
				if(total[end-1] != column ){
					
					for(var diff = 1; diff <= start ; diff ++){
						
						if ((end - diff + 1) <= 0){
							
							dic[start - diff + 1] = [0,0,0,0,0,0,0,0];
							total[start - diff] = 0 ;
							
						} else {
							
							dic[start - diff + 1] = dic[end - diff + 1];	
							total[start - diff] = total[end - diff];

						}
						
					}
					
					
					break;
				}
							
			}
			
			
		}
		
	}
	
	var static_block = [];
	var locked_block = [];
	
	for (var line = 1 ; line <= row ; line ++){
		
		for (var j = 1 ; j <=column ; j++){
			var text = '#Block' + NumberToText.i_text(line) + NumberToText.j_text(j) ;
			if (dic[line][j-1] == 1){
				locked_block.push(text);
			} else {
				static_block.push(text);
			}
			
		}
		
	}
	
	setBlocks.Static(static_block);
	setBlocks.Locked(locked_block);
	
	
	
}

function getNextBlocks(blocks,mode){ //mode: 'time' ,'left' , 'right' , 'down' ,'up'
	var nexts =[]
	var actBlocks = blocks;
	
	if(mode == 'time' || mode == 'down' ){
		
		for (var num in blocks){
			
			var len = blocks[num].length; 
			var next_i = parseInt(blocks[num].substring(len-5,len-3)) + 1;
			var j = parseInt(blocks[num].substring(len-2,len));
			next_text = '#Block' + NumberToText.i_text(next_i) + NumberToText.j_text(j) ;
			nexts.push(next_text);
			
		}
		
	} else if (mode == 'left'){
		
		for (var num in blocks){	
			var len = blocks[num].length;
			var j = parseInt(blocks[num].substring(len-2,len));
			
			if( j == 1){
				nexts = blocks;
				break;
			} else {
				var i = parseInt(blocks[num].substring(len-5,len-3));
				var next_j = j-1 ;
				next_text = '#Block' + NumberToText.i_text(i) + NumberToText.j_text(next_j) ;
				nexts.push(next_text);
			}  
			
		}

	} else if (mode == 'right'){
		
		for (var num in blocks){	
			var len = blocks[num].length;
			var j = parseInt(blocks[num].substring(len-2,len));
			if( j == column){
				nexts = blocks;
				break;
			} else {
				var i = parseInt(blocks[num].substring(len-5,len-3));
				var next_j = j+1 ;
				next_text = '#Block' + NumberToText.i_text(i) + NumberToText.j_text(next_j) ;
				nexts.push(next_text);
			} 
		}
		
	} else if (mode == 'up'){
		
		for (var num in blocks){
			
			var len = blocks[num].length;	
			var next_i = parseInt(blocks[num].substring(len-5,len-3)) - 1 ;
			var j = parseInt(blocks[num].substring(len-2,len));
			next_text = '#Block' + NumberToText.i_text(next_i) + NumberToText.j_text(j) ;
			nexts.push(next_text);
			
		}

	} 
	
	return nexts;
}

function isBlockLocked(blocks){
	
	var result = false;
	
	for (var num in blocks){
		if($(blocks[num]).css('font-size') == '0px'){
			result = true;
			break;
		}
	}
	
	return result;
	
}


function UpdateStatement(result,nowB,nextB,mode){
	if (result){
		if (mode == 'time' || mode == 'down'){
			setBlocks.Locked(nowB); // Lock these active blocks (V)
			
			cleanLine(); // Clean the lines & count scores
			
			
			blockCode = BuildingBlocks.NewBlock(blockNumber);
			blockNumber = BuildingBlocks.nextBlock();
			//recordBlock()  //Save into Session (X)
		}
	} else{
		setBlocks.Static(nowB);  // Set 'Static' state for these blocks; (V)
		setBlocks.Active(nextB); // Set 'Active' state for next blocks;  (V)
	}
	
}


/* function recordBlock(dic){
	return record = {
		'block_num': num,
		'Blocks': blocks
	}; 
} */

var NumberToText ={
	
	i_text : function(num_i){
		
		if ( num_i < 10 ){
			return 'i0' + num_i ;
		} else {
			return 'i' + num_i ;
		}

	} , 
	
	j_text : function(num_j){
		
		if ( num_j < 10 ){
			return 'j0' + num_j ;
		} else {
			return 'j' + num_j ;
		}

	} 
	
	
}



var changePac={ // Change Blocks Package ( Id:list , position(i,j) :dic )
		
	Decompo : function(blocks){ 
	
		var dic = {
			'i' : [],
			'j' : []
		}
		
		for (var num in blocks){
			var len = blocks[num].length;
				dic['i'].push(parseInt(blocks[num].substring(len-5,len-3)));
				dic['j'].push(parseInt(blocks[num].substring(len-2,len)));	
		}
		
		return  dic; // dictionary
	}  ,
	
	Compo : function(dict){
		
		var blocks = []
		
		for (var k = 0 ; k < dict['i'].length ; k++){
		
			var text = '#Block' + NumberToText.i_text(dict['i'][k]) + NumberToText.j_text(dict['j'][k]);
			blocks.push(text);
		}
		
		return blocks; //list
	}
	
	 
	
	
	
}


var setBlocks = {  //Set blocks state (active , static , locked)
	
	Active : function(nextBlocks){
		
		for (var num in nextBlocks){	
			$(nextBlocks[num]).css({
				'font-size':'20px',
				'background-color':'#fa2'
			});
		}
		
	}, 
	
	Static : function(nowBlocks){
		
		for (var num in nowBlocks){
			$(nowBlocks[num]).css({
				'font-size':'10px',
				'background-color':'#fff'
			});	
		}

	},
	
	Locked : function(nowBlocks){
		
		for (var num in nowBlocks){
			$(nowBlocks[num]).css({
				'background-color':'#fa2',
				'font-size':'0px'
			});	
		}
		
	}
}
