// ===========================model==============================
var model=[];
var model2=[];//for header
var model3=[];//for report using table
var model4=[];//Logout
var trackingTotal=0;//runing total
var goals=18000;//set goal for 5 hours 5*3600
var checkP=0;//set check point at 5 hours 5*3600
var sourceType = "";//source type from database base on useid

// ============================view =============================
function updateViewHeader()
{
	var rw = model2[0];
    var d = new Date();
    var n = d.getHours();			
    var s = "";
    if (n > 17)
    	s = "Evening";
    else if (n > 12 )
    	s= "Afternoon";
    else s="Morning";
	$("#hd").html("Good " + s +": " + rw.fname);
	sourceType = rw.sourcetype;
	console.log("updateViewHeader:"+rw.sourcetype);
	$("#sourceT").val(rw.sourcetype);
	
	if (sourceType=="audio"){
		$("#video-placeholder").hide();
		$("#au").show();
		$("#videofile2").hide();
		$("#videoMSG").hide();
	}
	else if (sourceType=="video") {
		$("#video-placeholder").show();
		$("#au").hide();
		$("#videofile2").show();
	}	
	else {
		$("#video-placeholder").hide();
		$("#au").hide();		
	}
}
function updateViewHeader2()
{
	var s="";
	if (trackingTotal > checkP)
		s=". Good job! ";
	else
		s=". Hurry up! ";
	
	$("#hd2").html("<small>You have completed " 
	+ secondsConvertHD(trackingTotal) + s +
	secondsConvertHD(goals-trackingTotal)+" more to hit your goal!</small>");
}
function updateViewReport()
{
	if (model3.error != undefined)
	{
		//console.log("updateViewReport-update view error");
		$("#message").text(model3.error);
	}
	else if(model3.notFound != undefined)
	{
		//console.log("updateViewReport-update view notFound");
		//$("#message").text("No record found");	
		$("#reportTableBody").empty();
	}
	else
	{
		trackingTotal=0;
		//console.log("updateViewReport-foud");
		$("#reportTableBody").empty();
		for (var i in model3)
		{
			var row = model3[i];
			var s=row.TmSp;
			var rw=row.Wk;
			
			trackingTotal=parseInt(trackingTotal)+parseInt(s);

			$("#reportTableBody").append("<tr>"+
			"<td>"+rw+"</td>"+
			"<td>"+secondsConvert(s)+"</td>" + 
			"<td>"+"<a id='"+rw+ "'href='#' class='dlog glyphicon glyphicon-star'></a></td>"+
			"</tr>");
		}
		$("#mediaMessage").html("Total:" + secondsConvertRP(trackingTotal));
	}
	//$("#ProgressChart").html("<div class=\"ProgressChartOuter\"><div class=\"ProgressChartInner\" style=\"height: "+(trackingTotal/goals*100)+"%;\"></div><div class=\"LabelLeft\" style=\"bottom: 100%;\">"+goals+"</div><div class=\"LabelRight\" style=\"bottom: "+(trackingTotal/goals*100)+"%;\">"+trackingTotal+"</div></div>");
	$("#ProgressChart").html("<div class=\"ProgressChartOuter\"><div class=\"ProgressChartInner\" style=\"height: "+
	(trackingTotal/goals*100)+"%;\"></div><div class=\"LabelRight\" style=\"bottom: "+
	(trackingTotal/goals*100-3)+"%;\">"+Math.round((trackingTotal/goals*100),2)+"%"+"</div></div>");
}
//----------------------------------------------------------------------
function updateView()
{
	if (model.error != undefined)
	{
		$("#message").text(model.error);
	}
	else if(model.notFound != undefined)
	{
	//	$("#message").text("No record found");					
	}
	else
	{
		//------for source list table---------
		$("#sourceTableBody").empty();
		for (var i in model)
		{
			var row = model[i];
			$("#sourceTableBody").append("<tr>"+
				"<td>"+row.title+"</td>"+
				"<td>"+row.duration+ " minutes" +"</td>" +
				"<td><a id='"+row.id+"' data-video-id='"+
				row.sr +"' sourceTy='"+row.types +"' data-title='"+ row.title +"' href='#' class='btns glyphicon glyphicon-play'></a></td>"+
				"</tr>");
		}
	}
}

//===================== controller===================================
$("#logOutBtn").click(function(){
	
	sendCommand5("clearSession");
	var url = "LogOut.html";
	window.open(url, '_self');	
	
});

$(document).ready(function ()
{
	console.log("Document Ready");
	sendCommand("sourceListV");//list all of source
	sendCommand4("getReport");//getting report
	sendCommand3("login2");//geting the user information to display on header
	document.getElementById("play3").disabled = true;
	document.getElementById("rewindebtn").disabled = true;
	document.getElementById("forwardbtn").disabled = true;
	document.getElementById("restartbtn").disabled = true;	
	
});

//this function is to save record
function sendCommand2(cmd)
{
	var url = "MSVideo.php?cmd="+cmd;
	var data = $("#stateForm" ).serialize();
    var request = $.post(url, data);
    request.done(function(json)
    {
        //console.log(json);
        model = json;
    });
    request.fail(function(jqXHR, textStatus, errorThrown)
    {
        $("#message").text(textStatus);
        console.log("fail object ", jqXHR);
        console.log("error thrown ", errorThrown);
        updateView();
    });
}            

/*============================================*/
function sendCommand(cmd)
{
	var url = "MSVideo.php?cmd="+cmd;
	console.log(url);
	var data = "";
    var request = $.post(url, data);
    request.done(function(json)
    {
    console.log(json);
    model = json;
    updateView();
});
request.fail(function(jqXHR, textStatus, errorThrown)
{
    $("#message").text("Error:" + textStatus);
    console.log("fail object ", jqXHR);
    console.log("error thrown ", errorThrown);
    updateView();
});

}		           
/*============================================*/
function sendCommand3(cmd)
{
	var url = "MSVideo.php?cmd="+cmd;
	console.log(url);
	var data = "";
    var request = $.post(url, data);
    request.done(function(json)
    {
    console.log(json);
    model2 = json;
    updateViewHeader();
});
request.fail(function(jqXHR, textStatus, errorThrown)
{
    $("#message").text("Error:" + textStatus);
    console.log("fail object ", jqXHR);
    console.log("error thrown ", errorThrown);
    updateView();
});
}
/*=================Report================================*/
function sendCommand4(cmd)//report
{
	var url = "MSVideo.php?cmd="+cmd;
	console.log(url);
	var data = "";
    var request = $.post(url, data);
    request.done(function(json)
    {
    console.log(json);
    model3 = json;
    updateViewReport();
    updateViewHeader2();
});
request.fail(function(jqXHR, textStatus, errorThrown)
{
    $("#message").text("Error:" + textStatus);
    console.log("fail object ", jqXHR);
    console.log("error thrown ", errorThrown);
    updateView();
});
}
/*=================Logout================================*/
function sendCommand5(cmd)//report
{
	var url = "MSVideo.php?cmd="+cmd;
	console.log(url);
	var data = "";
    var request = $.post(url, data);
    request.done(function(json)
    {
    console.log(json);
    model4 = json;

});
request.fail(function(jqXHR, textStatus, errorThrown)
{
    $("#message").text("Error:" + textStatus);
    console.log("fail object ", jqXHR);
    console.log("error thrown ", errorThrown);
});
}
/*--------------------------Help function-----------------*/
function secondsConvert(time){
	var m=0;
	var s= time;
	if (s>=60){
		m=Math.floor(s/60);
		s=s%60;
	}
	var h=0;
	if(m>60){
		h=Math.floor(m/60);
		m=m%60;
	}
    return h + ":" + m + ":" + s;
}
function secondsConvertHD(time){
	var m=0;
	var s= time;
	if (s>=60){
		m=Math.floor(s/60);
		s=s%60;
	}
	var h=0;
	if(m>60){
		h=Math.floor(m/60);
		m=m%60;
	}
    //return h + " : " + m + " hour(s)";
    return h + " hour" + (h==1?" ":"s ") + m + " minute" + (m==1?" ":"s");
}
function secondsConvertRP(time){
	var m=0;
	var s= time;
	
	if (s>=60){
		m=Math.floor(s/60);
		s=s%60;
	}
	var h=0;
	if(m>60){
		h=Math.floor(m/60);
		m=m%60;
	}
    return h + " hour" + (h==1?" ":"s ") + m + " minute" + (m==1?" ":"s and ") + s + " second" + (s==1?" ":"s");
}
