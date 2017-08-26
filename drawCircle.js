function drawElement( elementKind, prefix, uniqueNumber, styleObj, isCircle, hidden )
{
	var id = prefix+uniqueNumber;
	var div = document.getElementById(id);
	
	hidden = Math.random() < settings.likelyhoodOfHiding;	
	
	if( div == undefined )
	{
		div = document.createElement(elementKind);
		div.classList.add("circle");
		div.style.transition = "all "+settings.transitionSpeed+"s";
		div.id = id;
		div.uniqueNumber = uniqueNumber;
		document.getElementById("body").appendChild(div);
				
		styleObj["background-color"] = "rgba(0,0,0,0)";
		styleObj["height"] = "0";
		styleObj["width"] = "0";		
	}
	
	if(!hidden)
	{
		hidden = numberOfLoops <= div.uniqueNumber;
	}
	
	if(hidden)
	{
		styleObj["background-color"] = "rgba(0,0,0,0)";
		styleObj["height"] = "0";
		styleObj["width"] = "0";
	}
	
	var elementExsists = document.getElementById(id) == undefined;
	
	for(var k in styleObj)
	{
		//if(k == "zIndex"){continue;}
		div.style[k] = styleObj[k];
	}
	
	div.style.left = styleObj.left-(styleObj.width/2);
	div.style.top = styleObj.top-(styleObj.height/2);
	
	if(isCircle)
	{
		var rounding;
		if( styleObj.width > styleObj.height )
		{
			rounding = styleObj.height;
		}
		else
		{
			rounding = styleObj.width;			
		}
		div.style.borderRadius = (rounding/2)+"px";
	}
	
}