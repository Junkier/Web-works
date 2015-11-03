$(document).ready(function(){

	$('#startbutton').click(function(){
		$(this).fadeOut(800,doFirst);
		
	});
	
	$('html').keydown(function(event){
		if (event.which == 32){
			$('#startbutton').fadeOut(800,doFirst);
		}
	});

});
