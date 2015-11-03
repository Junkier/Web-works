block = true;
block_num = 0;

function doFirst(){

	myInterval = setInterval(Update,1000);
	$('html').click(clearMyInterval);
	$('html').keydown(changeState);
}

function Update(){
	// Scan which is active Block (V)
	act = activeBlock();
	Blocks ={
		'block_num' : block_num ,
		'ActiveBlock' : act
	}
	// Judge next block is Lock or not (act is arrays) (V)
	var result = isNextBlockLocked(Blocks); // T or F
	
	// Update the Statement (V)
	UpdateStatement(result);
	
}

function changeState(event){ // Bug 一堆 == 
	if (event.which == 37){
		// Left
		var actBlocks = activeBlock();
		var nextact = [];

		for (var k = 0 ; k < actBlocks.length ; k++){
			$(actBlocks[k]).css({
			'font-size':'20px', 
			'background-color':'#fff'
			});
			var len = actBlocks[k].length;
			var next_j = parseInt(actBlocks[k].substring(len-1,len)) - 1;
			var i = actBlocks[k].substring(len-2,len-1) ;
			var next_text = '#Block' + i + next_j;
			nextact.push(next_text);
		}
	
		setActiveBlock(nextact);
	
	} else if(event.which == 39){
		// Right
		var actBlocks = activeBlock();
		var nextact = [];

		for (var k = 0 ; k < actBlocks.length ; k++){
			$(actBlocks[k]).css({
			'font-size':'20px', 
			'background-color':'#fff'
			});
			var len = actBlocks[k].length;
			var next_j = parseInt(actBlocks[k].substring(len-1,len)) + 1;
			var i = actBlocks[k].substring(len-2,len-1) ;
			var next_text = '#Block' + i + next_j;
			nextact.push(next_text);
		}
	
		setActiveBlock(nextact);
		
	} else if(event.which == 40){
		// Down
	} else if(event.which == 38){
		// UP (change way)
	} else if(event.which == 32){
		// Space (down rapidly)
	}
	
	
}


function activeBlock(){
	var actBlock = [];
	
	for(var i =1 ; i <=6; i++){
		for (var j = 1 ; j<=4 ; j++){
			var text = '#Block' + i + j ;
			if($(text).css('font-size') == '30px'){
				actBlock.push(text);
			} 
		}
	}
	
	return actBlock;
}

function isNextBlockLocked(blocks){
	
	var result = false;
	var actBlocks = blocks['ActiveBlock'];
	
	for (var i = 0 ; i < actBlocks.length ; i++){
		var len = actBlocks[i].length;
		var next_i = parseInt(actBlocks[i].substring(len-2,len-1)) + 1;
		var j = actBlocks[i].substring(len-1,len) ;
		var next_text = '#Block' + next_i + j;
		if ($(next_text).css('font-size') == '0px'){
			result = true;
			break;
		}
	}
	
	return result;
	
}


function UpdateStatement(result){
	
	if (result){
		//alert('QQ');
		setLock(Blocks); // Lock these active blocks (V)
		//cleanLine(); // Clean the lines & count scores
		NewBlock();
	} else{
		var next = setStaticBlock(Blocks); // Set 'Static' state for these blocks & return next blocks; (V)
		setActiveBlock(next); // Set 'Active' state for next blocks; (V)

	}
	
}

function setLock(blocks){
	
	var actBlocks = blocks['ActiveBlock'];
	
	for (var i = 0 ; i <actBlocks.length ; i++){
		$(actBlocks[i]).css('font-size','0px');		
	}


}

function setStaticBlock(blocks){
	var nextact = [];
	var actBlocks = blocks['ActiveBlock'];
	
	for (var k = 0 ; k < actBlocks.length ; k++){
		
		$(actBlocks[k]).css({
			'font-size':'20px', 
			'background-color':'#fff'
		});

	}
	
	for (var i = 0 ; i < actBlocks.length ; i++){
		var len = actBlocks[i].length;
		var next_i = parseInt(actBlocks[i].substring(len-2,len-1)) + 1;
		var j = actBlocks[i].substring(len-1,len) ;
		var next_text = '#Block' + next_i + j;
		nextact.push(next_text);
	}
	
	return nextact ;
}

function setActiveBlock(nextBlocks){
	  
	for (var i = 0 ; i < nextBlocks.length ; i++){	
		$(nextBlocks[i]).css({
			'font-size':'30px', 
			'background-color':'#fa2'
		});
	}
	
}

function NewBlock(){
	block = true;
	while(block){
	block_num +=1; 
	$('#Block12').css('background-color','#fa2');
	$('#Block12').css('font-size','30px');
	$('#Block13').css('background-color','#fa2');
	$('#Block13').css('font-size','30px');
	$('#Block22').css('background-color','#fa2');
	$('#Block22').css('font-size','30px');
	$('#Block23').css('background-color','#fa2');
	$('#Block23').css('font-size','30px');
	block = false;
	
}
}




function clearMyInterval(){
	
	clearInterval(myInterval);
	
}


window.addEventListener('load',doFirst,false);