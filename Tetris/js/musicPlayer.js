// change music

function musicPlayer(){
    $("#jquery_jplayer_1").jPlayer({
		
        ready: function () {
			$(this).jPlayer("setMedia", {
				title: "血腥愛情故事",
				mp3: "./music/AMIT [血腥愛情故事 A Bloody Love Story] Official HD MV.mp3",
				oga: "http://www.jplayer.org/audio/ogg/Miaow-07-Bubble.ogg",
				m4a: "http://www.jplayer.org/audio/m4a/Miaow-07-Bubble.m4a",
			} 
			/*
			[{
				title: "血腥愛情故事",
				mp3: "./music/AMIT [血腥愛情故事 A Bloody Love Story] Official HD MV.mp3",
				oga: "http://www.jplayer.org/audio/ogg/Miaow-07-Bubble.ogg",
				m4a: "http://www.jplayer.org/audio/m4a/Miaow-07-Bubble.m4a",
			} ,
			{
				title: "血腥愛情故事",
				mp3: "./music/Thrift_shop.mp3",
				oga: "http://www.jplayer.org/audio/ogg/Miaow-07-Bubble.ogg",
				m4a: "http://www.jplayer.org/audio/m4a/Miaow-07-Bubble.m4a",	
			}]
	*/
			).jPlayer('play');
        },
		
        cssSelectorAncestor: "#jp_container_1",
        swfPath: "./js",
        supplied: "mp3, oga , m4a",
		volume:0.5,
        useStateClassSkin: true,
        autoBlur: true,
        smoothPlayBar: true,
        keyEnabled: false,
        remainingDuration: true,
        toggleDuration: true
    });
}