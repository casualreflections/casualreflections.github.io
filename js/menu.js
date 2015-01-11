var speed = 400;//speed of hover effect
var menuFadeIn = 350;//speed of menu fade in transition
var menuFadeOut = 350;//speed of menu fade in transition
var totalWidth = 0;//variable for calculating total width of menu according to how many li's there are
var reducedWidth = 4;
var menuHoverHeight = 50;//height of hover effect

(function($) {	
$(document).ready(function(){
	if($.browser.opera){//opera padding fix	
		$(".nav ul").css("margin-top", "19px");
	}
    $(".nav ul ul").css("margin-top", "-20px");
	$(".nav li:first").css({borderLeft:"none"});
	$(".nav li:last").css({borderRight:"none"});
	$('.nav li').append('<div class="hover"><\/div>');
	
       totalWidth = $(".nav li:last").offset().left -  $(".nav li:first").offset().left + $(".nav li:last").width();//width of menu
	   $(".nav").css({width:totalWidth + 1});//setting total width of menu
	   
	   var dLeft = $('.nav li:first').offset().left;//setting default position of menu
	   var dWidth = $('.nav li:first').width() + reducedWidth;
	   var dTop = $('.nav li:first').offset().top;
	   
		//Set the initial lava lamp position and width
		$('#box').css({left:dLeft});
		$('#box').css({top: dTop});
		$('#box').css({width: dWidth});
	
	
	$(".nav > li").hover(function(){
		var width = $(this).width()+ reducedWidth; 
		$(this).find('li').css({width:(width - reducedWidth * 2 - 1)});	
		if($.browser.opera){
			$(this).children('div').css("margin-top", "-32px");//opera padding fix
			
			}
		$(this).find('a:first').stop().animate({color:"#1E1E20"},{duration:speed});//setting color of rollover effect
		$(this).children('div').stop().animate({height:(menuHoverHeight)},{duration:speed});
		
		},	
		function(){
			$(this).find('a:first').stop().animate({color:"#ffffff"},{duration:speed});//setting color of rollout effect
			$(this).children('div').stop().animate({height:"0px"},{duration:speed});
			
		});


	 $(".submenu").hover(function(){//animating the fade in and fade out of submenus level 1
        $(this).find('li').fadeIn(menuFadeIn); 
		$('li li li').css({display:"none"});
		},
        function(){  
		    $(this).find('li').fadeOut(menuFadeIn); 
	    });  
		
    	 $(".submenu2").hover(function(){//animating the fade in and fade out of submenus level 2 
			$(this).find('li').fadeIn(menuFadeIn);  
			$('li li li li').css({display:"none"});
			
		},
        function(){  
            $(this).find('li').fadeOut(menuFadeOut); 
			
        }); 
		 $(".submenu3").hover(function(){//animating the fade in and fade out of submenus  level 3
        $(this).find('li').fadeIn(menuFadeIn);  
		},
        function(){  
            $(this).find('li').fadeOut(menuFadeOut); 
			

        }); 
});

})($);
