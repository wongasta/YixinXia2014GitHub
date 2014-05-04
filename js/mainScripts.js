//Defines all reusables here
var reuseModule = {
	//Some rgb converter found online
	hexToRgb: function(hex, alpha) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? 
		//rgba(44, 111, 104, 0.8);
		'rgba('+parseInt(result[1], 16)+','+parseInt(result[2], 16)+','+parseInt(result[3], 16)+','+alpha+')' : null;
	},
	//If user changes window size half way then it restores the menu
	//Also handles the color change of nav menu text upon resize
	restoreMenu: $(window).on("resize", function(event){
		$('.chartText').css({'opacity': '0.8'});
		if($(this).width()>=768){
			if($('.mainNav .navbar-nav').css('display')==='none'){
				$('.mainNav .navbar-nav').css({'display': 'block'});
			}
			$('.navbar-nav a').css({'color': '#fff'});
		}else{
			$('.navbar-nav a').css({'color': '#000'});
		}
	})
};

//Main module for all jquery animations and page related events
var mainModule = {
	//Handles scrolling down and up on the nav menu
	scrollLinkClick: $('.scroll-link').on('click', function(event){
		event.preventDefault();
		var sectionID = $(this).attr("data-id");
		mainModule.scrollToID('#' + sectionID, 400);
	}),
	//function called by above function
	scrollToID: function (id, speed){
		var offSet = 50;
		var targetOffset = $(id).offset().top - offSet;
		var mainNav = $('#main-nav');
		$('html,body').animate({scrollTop:targetOffset}, speed);
		if (mainNav.hasClass("open")) {
			mainNav.css("height", "1px").removeClass("in").addClass("collapse");
			mainNav.removeClass("open");
		}
	},
	//Controls color change regarding on hover states
	navLinkHoverIn: $('.mainNavTop .scroll-link').on('mouseenter', function(){
		var elementColor
		if($(window).width()>=768){
			elementColor = mainModule.navLinkColors($(this).data('colorchange'));
		}else{
			elementColor = '#2f2f2f';
		}
		$(this).css({'color': elementColor});
		$('#logoImg').css({'border-bottom-color': elementColor});
	}),
	navLinkHoverOut: $('.mainNavTop .scroll-link').on('mouseleave', function(){
		$(this).css({'color': mainModule.handleBWFont()});
		$('#logoImg').css({'border-bottom-color': '#fff'});
	}),
	//Switch called by above 2 functions to get color values
	navLinkColors: function(color){
		var hexColor;
		switch(color){
            case 'grey':
                hexColor = '#cdcbaf';
                break
			case 'blue':
				hexColor = '#b3ece6';
				break;
			case 'orange':
				hexColor = '#f2dd9c';
				break;
			case 'green':
				hexColor = '#cef29c';
				break;
			case 'red':
				hexColor = '#eaac9b';
				break;
			case 'teal':
				hexColor = '#37cc81';
				break;
			default:
				hexColor = mainModule.handleBWFont();
		}
		return hexColor;
	},
	handleBWFont: function(){
		if ($(window).width()>=768){
				return '#fff';
			}else{
				return '#000';
			}
	},
	//Handles menu button on certain breakpoints
	toggleMenu: $('.menuToggle a').on('click', function(e){
		e.preventDefault();
		$('.navbar-nav').slideToggle(500);
	}),
	//handlesWaypoints
	timelineWP: $('.skillsBacktoTop').waypoint(function() {
	  if($(window).width()>=900){
		  $('body').removeClass();
		  $('body').addClass('bodyTransition');
		  $('body').addClass('bodybg0');
	  }
	}),
	activitiesWP: $('#activities').waypoint(function() {
	   if($(window).width()>=900){
		  $('body').removeClass();
		  $('body').addClass('bodyTransition');
		  $('body').addClass('bodybg1');
	   }
	}),
	//very basic animation
	chainHeaders: function(){
		$('.mainDesc').css({'opacity': '1', 'left': '0'});
	}
};

//Individual components 
//Timeline module 
var timelineModule={
	mouseOverTL: $('.timelineList a').on('mouseenter', function(){
		$('.timelineList a').removeClass('active');
		$(this).addClass('active');
		var dataId = $(this).data('tlid')
		$('#timeline').removeClass('timelineDefault timeline1 timeline2 timeline3 timeline4 timeline5');
		$('#timeline').addClass('timeline' + dataId);
		$('#timeline .rightCol div').hide();
		$('#timeline .rightCol .contentDiv' + dataId).fadeIn(300);
	}),
	mouseOverPD: $('.timelineList a').on('click', function(e){
		e.preventDefault();
	})
};

//handles skills
var skillsModule={
	chartShown: 0,
	displayChart: function(displayDiv) {
	 // Build the chart - HIGH CHART MUST BE INCLUDED FOR IT TO WORK
	 $(displayDiv).highcharts({
		 chart: {
			 plotBackgroundColor: null,
			 plotBorderWidth: null,
			 plotShadow: false,
			 backgroundColor: null
		 },
		 title: {
			 text: ''
		 },
		 tooltip: {
			 enabled: false
		 },
		 plotOptions: {
			 pie: {
				 borderWidth: 0,
				 allowPointSelect: true,
				 cursor: 'pointer',
				 showInLegend: false,
				 dataLabels: {
					 enabled: true,
					 distance: -58,
					 color: '#fff',
					 formatter: function () {
						 return '<div data-pieSlice="' +  this.point.name+ '"><p class="chartText"><strong>' + this.point.name + '</strong></p><p class="chartText">' + Highcharts.numberFormat(this.percentage) + ' %</p></div>';
					 },
					 useHTML: true
				 },
				 point: {
					 events: {
						 //Handles mouse over events
						 mouseOver: function(e){
							 var rgbColor = reuseModule.hexToRgb(this.color, '0.7');
							 var rgbColorLight = reuseModule.hexToRgb(this.color, '0.3');
							 var rgbColorHeavy = reuseModule.hexToRgb(this.color, '1');
							 skillsModule.chartHoverDisplay(this.name, rgbColor, rgbColorLight, rgbColorHeavy);
							 $('div[data-pieSlice="'+ this.name +'"] .chartText').css({'font-size': '14px'});
							 $('div[data-pieSlice="'+ this.name +'"] .chartText').css({'opacity': '1'});
						 },
						 mouseOut : function(e){
						 	$('.chartText').css({'font-size': '11px'});
							$('.chartText').css({'opacity': '0.8'});
						 }
					 }
				 }
			 }
		 },
		 exporting: {
			 enabled: false
		 },
		 credits: {
			 enabled: false
		 },
		 series: [{
			 type: 'pie',
			 data: [{
				 name: 'Web Design',
				 y: 30,
				 color: '#2c6f68'
			 }, {
				 name: 'JS',
				 y: 25,
				 color: '#6f4d15'
			 }, {
				 name: 'UI/UX',
				 y: 15,
				 color: '#38580d'
			 }, {
				 name: 'Web Development',
				 y: 15,
				 color: '#5c1d0c'
			 }, {
				 name: 'IT',
				 y: 15,
				 color: '#333333'
			 }]
		 }]
	 })
	},
	chartHoverDisplay: function(data, color, colorL, colorH){
		$('.addDataContainer > div').hide(0, function(){
			$('.addDataContainer div[data-chartName="' + data + '"]').css({ 'background-color' : color });
			$('.addDataContainer div[data-chartName="' + data + '"]').show();
		});
	},
	mobileNav: $('.mobileSelector a').on('mouseover', function(e){
		e.preventDefault();
		$('.addDataContainer > .skillsDiv').hide();
		$('.addDataContainer div[data-chartName="' + $(this).data('key') + '"]').show();
	}),
	mobileNavClick: $('.mobileSelector a').on('click', function(e){
		e.preventDefault();
	})
};

//Portfolio module here
var portfolioModule = {
	carouselOptions: $('.carousel').carousel({
	  interval: false
	}),
	portfolioNav: $('#portfolio .portPoint a').on('click', function(e){
		e.preventDefault();
		var clickedPoint = $(this).data('slide');
		if (!$(this).hasClass('active')){
			$('#portfolio .portPoint a').removeClass('active');
			$(this).addClass('active');
			$('.slidersContainer > .carousel').hide();
			$('.slidersContainer > .carousel#' + clickedPoint + 'Slide').fadeIn(150);
		}
	}),
	modalClickClose: $('.modal-content').on('click', function(){
		$(this).closest('.modal').modal('hide');
	}),
	viewLive: $('#portfolio .buttonView').on('click', function(){
		var liveLink = $(this).data('livelink');
		window.open(liveLink, '_blank');
		return false;
	})
}

//Activities module - only one functin to be called outside of angular
var activitiesModule = {
    changeBGColor: function(color, borderColor){
        $('#activities').css({'background-color': color, 'border-top-color': borderColor });
    }
}

$(document).ready(function() {
	
	//set the opacity to 0 orignally when page loads
	var requiredOnLoad = {
		mainTextLoad: mainModule.chainHeaders(),
		highChartLoad: $('#timeline').waypoint(function(){
			if (!skillsModule.chartShown){
				skillsModule.displayChart('#mainChartContainer');
				skillsModule.chartShown++;
			}
			$('.chartText').css({'opacity': '0.8'});
		})
	}
	
});








