var settings = localStorage.getItem("settings") || {};

settings.levelOfAlphaReduction = .1;  // max amout to subtract from full opaque
settings.maxNumberOfElements = 6; // maximum number of elements to show up on a 1000 x 1000 screen

settings.useSquares = true; // if both are false, then acts like both are true
settings.useCircles = true;

settings.likelyhoodOfSquare = .5;
settings.likelyhoodOfHiding = .25; // likelyhood the shape hides for one cycle

settings.transitionSpeed = 2; // transition speed in seconds
settings.stillLength = 0; // amount of time to sit still before moving again in seconds

settings.density = settings.maxNumberOfElements/(1000*1000); // Should be in the form "maxNumberOfElements/(1000*1000)"

window.onload = main;
window.onresize = main;
//window.onkeydown = abortFunction;
window.onkeydown = openSettings;

var timeoutReturn = {};
var needToCallMain = false;
var firstRun = true;

function abortFunction(timeoutReturn)
{
	if (timeoutReturn !== undefined)
	{
		clearTimeout(timeoutReturn)
	}
}

var numberOfLoops = 9999999999;;
function main()
{
	if(!firstRun)
	{
		for(var k in timeoutReturn)
		{
			abortFunction( timeoutReturn[k] );
		}
	}
		
	numberOfLoops = parseInt( settings.density * ( window.innerWidth * window.innerHeight ));
	numberOfLoops = numberOfLoops == 0 ? 1 : numberOfLoops;
		
	var lastCircle = document.getElementById("circle"+numberOfLoops);
	if(lastCircle !== undefined && lastCircle !== null)
	{
		startDrawCircleLoop(numberOfLoops, numberOfLoops, true);
	}
	
	var circles = document.getElementsByClassName("circle");
	
	var realNumberLoops = circles.length > numberOfLoops ? circles.length : numberOfLoops;
	for(var i=0; i<realNumberLoops; i++)
	{
		startDrawCircleLoop(i, numberOfLoops, false);
	}
	
	if(firstRun)
	{
		firstRun = false;
		main();		
	}
	
}

function startDrawCircleLoop(i, numberOfLoops, hidden)
{
	startDrawCircle(i, numberOfLoops, hidden);
		
	abortFunction(timeoutReturn[i])
	
	timeoutReturn[i] = setTimeout(function()
	{
		if(needToCallMain)
		{
			main();
		}
		else
		{
			startDrawCircleLoop(i, numberOfLoops, hidden);
		}
	}, (parseInt(settings.transitionSpeed)+parseInt(settings.stillLength))*1000 )
	
	console.log("timeout for "+((settings.transitionSpeed+settings.stillLength)*1000))
}

function startDrawCircle(i, numberOfLoops, hidden)
{
	var maxLargeHeight = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;
	
	//console.log("maxLargeHeight is "+maxLargeHeight)
	
	var increment = maxLargeHeight/numberOfLoops;
	var left = (Math.random() * 10000) % window.innerWidth;
	var top = (Math.random() * 10000) % window.innerHeight;

	drawCircles(left, top, i, i*increment, i*increment+increment, hidden);

	return ;
}

function drawCircles(left, top, circleNumber, minWidth, maxWidth, hidden)
{
	//console.log("minWidth is "+minWidth+" maxWidth is "+ maxWidth )
	var mNum = parseInt(window.height) / 4;
	mNum = 200;
	
	var width = Math.random();
	width = width * (maxWidth - minWidth);
	width = width+minWidth;
	
	var height = width;

	var o =
	{
		// these top 4 are requred
		"left":left,
		"top":top,
		"width":width,
		"height":height,
		
		"zIndex" : parseInt(mNum - width),
		"position" : "absolute",
		//"background":"linear-gradient(to right, "+getRandomColor()+", "+getRandomColor()+")",
		//"background":"linear-gradient("+getRandomAngle()+", "+getRandomColors()+")",
		"background-color" : getRandomColor()
	};

	//console.log("o.background is "+o.background);

	var isCricle = true;
	
	if( settings.useSquares && settings.useCircles || !settings.useSquares && !settings.useCircles )
	{
		isCricle = Math.random() > settings.likelyhoodOfSquare;
	}
	else if( settings.useSquares && !settings.useCircles)
	{
		console.log("ONLY USING SQUARES");
		isCricle = false;
	}
	

	drawElement("div", "circle", circleNumber, o, isCricle, hidden);
}

function getRandomAngle()
{
	return parseInt((Math.random() * 360) % 360) + "deg";
}

function getRandomColors()
{
	var r = parseInt((Math.random() * 255) % 255);
	var g = parseInt((Math.random() * 255) % 255);
	var b = parseInt((Math.random() * 255) % 255);

	return "rgba(" + r + "," + g + "," + b + "), rgba(" + (255 - r) + "," + (255 - g) + "," + (255 - b) + ")";

}

function getRandomColor()
{
	var r = parseInt((Math.random() * 255) % 255);
	var g = parseInt((Math.random() * 255) % 255);
	var b = parseInt((Math.random() * 255) % 255);
	
	var a = 1 - (Math.random() * settings.levelOfAlphaReduction);

	return "rgba(" + r + "," + g + "," + b + ", "+a+")";
}

function openSettings(e)
{
	console.log( e );
	if(e.code !== "KeyS")
	{return;}
		
	var currentHeight = settingsContainer.style.height.split("px")[0];
	console.log( currentHeight );
	if( currentHeight > 0)
	{
		settingsContainer.style.height = 0;
	}
	else
	{
		var children = settingsContainer.children;
		var maxHeight = -1;
		for( var i=0; i< children.length; i++)
		{
			var eHeight = children[i].getBoundingClientRect().height;
			console.log("eHeight is "+eHeight);
			maxHeight =  eHeight > maxHeight ? eHeight : maxHeight;
		}
		settingsContainer.style.height = window.innerHeight/4;
		console.log("maxHeight is "+maxHeight)
		
		for(var k in settings) // to populate data in settings
		{
			var e = document.getElementById(k+"Setting")
			console.log(e);
			console.log(k);
			if(e==undefined)
				continue;
			if( e.type == "checkbox" )
			{
				e.checked = settings[k];
			}
			else // assume it is an input box
			{
				e.value = settings[k];
			}
		}
	}
}

function saveSettings()
{
	for(var k in settings) // to populate data in settings
	{
		var e = document.getElementById(k+"Setting")
		console.log(e);
		console.log(k);
		if(e==undefined)
			continue;
		if( e.type == "checkbox" )
		{
			settings[k] = e.checked;
		}
		else // assume it is an input box
		{
			settings[k] = e.value;
		}
	}
	
	var circles = document.getElementsByClassName("circle");
	for(var k=0; k<circles.length; k++)
	{
		circles[k].style.transition = "all " + settings.transitionSpeed + "s";
	}
	
	settingsContainer.style.height = 0;
}


























