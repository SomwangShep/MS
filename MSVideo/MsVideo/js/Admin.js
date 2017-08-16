// ===========================model==============================
var adminModel=[];
var adminUser=[];
var adminWeek=[];
var weekDetailModel = [];
var adminUser2=[];
var userTot=0;
var modal = document.getElementById('dlogs');

// ===========================view===============================
$(document).ready(function ()
{
	$("#stateForm").toggle();
	$("#newBtn").hide();  
	sendCommandAdminHD("login2");//geting the user information to display on header
	sendCommandAdminGetUser("getUserList");
	sendCommandAdminGetWeek("getWeekList");
});
//list all user for admin
function updateViewAdminUser()
{
  $("#message").show();
  $("#message").html("");
  $("#fd2").html("");
  $("#hd2").html("Admin");
  //---------------------error------------------------
  if (adminUser2.error != undefined)
  {
  	$("#message").html("<div style = color:red>" + adminUser2.error);
  	if (adminUser2.error == "Database is empty, please add records")
  	{
  		$("#reportTableBodyAdmin").empty();
  	}
  }
  else
  {  
    $("#reportTableBodyAdmin").empty();
    document.getElementById("ReportHeader").style.display="none";
    document.getElementById("ReportHeaderAlt").style.display="none";
    document.getElementById("ReportHeaderAlt2").style.display="table-row";

  	for (var i in adminUser2)
  	{
      var row = adminUser2[i];
  
  		$("#reportTableBodyAdmin").append("<tr>"+
  		"<td>"+row.userid + "</td>"+
  		"<td>"+row.fname + "</td>"+
  		"<td>"+row.lname + "</td>"+
  		"<td>"+row.sourcetype+"</td>" + 
			"<td><a ID='"+row.id +"' login='"+row.userid +"' fname='"+row.fname+"' lname='"+row.lname+"' group='"+row.sourcetype +"' href='#' class='editBtn glyphicon glyphicon-edit'></a></td>"+
			"<td><a ID='"+row.id +"' href='#' class='delBtn glyphicon glyphicon-remove'></a></td>"+
  		"</tr>");
  	} 
  }
}

function updateViewHeaderAdmin()
{
	var rw = adminModel[0];
  var d = new Date();
  var n = d.getHours();			
  var s = "";
  if (n > 17)
    s = "Evening";
  else if (n > 12 )
    s= "Afternoon";
  else s="Morning";
	$("#hd").html("Good " + s +": " + rw.fname);
}

function updateViewUserListAdmin()
{
  var j = 0;
  for (var i in adminUser)
  {
    j=j+1;
  	var row = adminUser[i];
  $("#userTableBody").append("<tr>"+
  		"<td><a id='"+row.id+"' total='"+
  		row.tot + "' names='" + row.fname + " " + row.lname + "' href='#' class='userDetail'>"+ j + ". " +row.fname +  " " + row.lname + " ("+secondsConvert(row.tot)+ ")"+ "</a></td>"+
  		"</tr>");				
  }
}
function updateViewWeekListAdmin()
{
  var j = 0;
	for (var i in adminWeek)
	{
	  j=j+1;
		var row = adminWeek[i];
	$("#weekTableBody").append("<tr>"+
			"<td><a id='"+row.weeksNumber+"' total='"+
			row.tot +"' href='#' class='viewsDetail'>"+ row.weeksNumber +  " ("+secondsConvert(row.tot)+ ")"+ "</a></td>"+
			"</tr>");				
	}
}

function updateViewUserDetail()
{
  $("#reportTableBodyAdmin").empty();
  document.getElementById("ReportHeader").style.display="table-row";
  document.getElementById("ReportHeaderAlt").style.display="none";
  document.getElementById("ReportHeaderAlt2").style.display="none";
  userTot=0;
	for (var i in weekDetailModel)
	{
    var row = weekDetailModel[i];
    var tot=row.tot;
    userTot=parseInt(userTot)+parseInt(tot);
		
		$("#reportTableBodyAdmin").append("<tr>"+
		"<td>"+row.weeksNumber + "</td>"+
		"<td>"+row.sourcetype + "</td>"+
		"<td>"+row.title + "</td>"+
		"<td>"+secondsConvert(row.tot)+"</td>" + 
		"</tr>");
	}
	$("#fd2").html("Total : " + secondsConvertRP(userTot));
}
function updateViewWeekDetail()
{
  userTot=0;

  $("#reportTableBodyAdmin").empty();
  document.getElementById("ReportHeader").style.display="none";
  document.getElementById("ReportHeaderAlt").style.display="table-row";
  document.getElementById("ReportHeaderAlt2").style.display="none";
	for (var i in weekDetailModel)
	{
		var row = weekDetailModel[i];
    var tot=row.tot;
	  userTot=parseInt(userTot)+parseInt(tot);		
	  
		$("#reportTableBodyAdmin").append("<tr>"+
		"<td>"+row.fname + " " + row.lname +"</td>"+
		"<td>"+row.sourcetype + "</td>"+
		"<td>"+row.title + "</td>"+
		"<td>"+secondsConvert(row.tot)+"</td>" + 
		"</tr>");
	}
	$("#fd2").html("Total : " + secondsConvertRP(userTot));
}
// ==========================controller=============================
function sendCommandAdminHD(cmd)
{
	var url = "MSVideo.php?cmd="+cmd;
	console.log(url);
	var data = "";
  var request = $.post(url, data);
  request.done(function(json)
  {
    console.log(json);
    adminModel = json;
    updateViewHeaderAdmin();
  });
  request.fail(function(jqXHR, textStatus, errorThrown)
  {
    $("#message").text("Error:" + textStatus);
    console.log("fail object ", jqXHR);
    console.log("error thrown ", errorThrown);
  });
}
function sendCommandAdminGetUser(cmd)
{
	var url = "MSVideo.php?cmd="+cmd;
	console.log(url);
	var data = "";
  var request = $.post(url, data);
  request.done(function(json)
  {
    console.log(json);
    adminUser = json;
    updateViewUserListAdmin();
  });
  request.fail(function(jqXHR, textStatus, errorThrown)
  {
    $("#message").text("Error:" + textStatus);
    console.log("fail object ", jqXHR);
    console.log("error thrown ", errorThrown);
  });
}
function sendCommandAdminGetWeek(cmd)
{
	var url = "MSVideo.php?cmd="+cmd;
	console.log(url);
	var data = "";
  var request = $.post(url, data);
  request.done(function(json)
  {
    console.log(json);
    adminWeek = json;
    updateViewWeekListAdmin();
  });
  request.fail(function(jqXHR, textStatus, errorThrown)
  {
    $("#message").text("Error:" + textStatus);
    console.log("fail object ", jqXHR);
    console.log("error thrown ", errorThrown);
  });
}
/*================== click on the list Report==============*/
$(document).on("click", ".userDetail", function()
{
	$("#uid2").val($(this).attr("id"));
	sendCommandGetUserDetail("getUserDetail");
	$("#hd2").html("Detail for: " + $(this).attr("names"));
	$("#newBtn").hide(1000);
	$("#stateForm").hide(1000);
	$("#message").hide();
});

function sendCommandGetUserDetail(cmd)
{
	var url = "MSVideo.php?cmd="+cmd;
	var data = $("#adminForm" ).serialize();
    var request = $.post(url, data);
    request.done(function(json)
    {
        console.log(json);
        weekDetailModel = json;
        updateViewUserDetail();
    });
    request.fail(function(jqXHR, textStatus, errorThrown)
    {
        $("#message").text(textStatus);
        console.log("fail object ", jqXHR);
        console.log("error thrown ", errorThrown);
    });
} 
/*================== click on the list Week==============*/
$(document).on("click", ".viewsDetail", function()
{
	$("#weekN").val($(this).attr("id"));
	sendCommandGetWeekDetail("getWeekDetail");
	$("#hd2").html("Detail for: " + $(this).attr("id"));
	$("#newBtn").hide(1000);
	$("#stateForm").hide(1000);
	$("#message").hide();
});

function sendCommandGetWeekDetail(cmd)
{
	var url = "MSVideo.php?cmd="+cmd;
	var data = $("#adminForm" ).serialize();
  var request = $.post(url, data);
  request.done(function(json)
  {
      console.log(json);
      weekDetailModel = json;
      updateViewWeekDetail();
  });
  request.fail(function(jqXHR, textStatus, errorThrown)
  {
      $("#message").text(textStatus);
      console.log("fail object ", jqXHR);
      console.log("error thrown ", errorThrown);
  });
}     

/*=================Logout================================*/
$("#logOutBtn").click(function(){
	
	sendCommand5("clearSession");
	//var url = "../MSVideo.html";
	var url = "LogOut.html";
	window.open(url, '_self');	
});

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
/*========================== Admin ==================*/
function clearForm()
{
	$("#loginid").val("");
	$("#fname").val("");
	$("#lname").val("");
	$("#group").val("audio");
}

$("#newBtn").click(function(){
  clearForm();
	$("#stateForm").toggle(1000);
	$("#addBtn").show();
	$("#updBtn").hide();
});

$("#ad").click(function(){
  sendCommandGetUser("getAllUser");
  $("#newBtn").show(1000);

});

$("#addBtn").click(function ()
{
  sendCommand("addUser");
  $("#stateForm").hide(1000);
});

$("#updBtn").click(function ()
{
  sendCommand("updateUser");
  $("#stateForm").hide(1000);
});

$(document).on("click", ".delBtn", function()
{
  $("#uid").val($(this).attr("id"));
  modal.style.display = "block";
});

$("#canBtn").click(function ()
{
  $("#stateForm").hide(1000);
});

function sendCommandGetUser(cmd)
{
	var url = "MSVideo.php?cmd="+cmd;
	//this is where we using hiddent in form
	//var data = $("#stateForm" ).serialize();
	var data="";
  var request = $.post(url, data);
  request.done(function(json)
  {
      console.log(json);
      adminUser2 = json;
      updateViewAdminUser();
  });
  request.fail(function(jqXHR, textStatus, errorThrown)
  {
      $("#message").text(textStatus);
      console.log("fail object ", jqXHR);
      console.log("error thrown ", errorThrown);
  });
}  
//add a new user
function sendCommand(cmd)
{
  console.log("sendCommand");
  var url = "MSVideo.php?cmd="+cmd;
  var data = $("#stateForm" ).serialize();
  var request = $.post(url, data);
  request.done(function(json)
  {
  	console.log(json);
      adminUser2 = json;
      updateViewAdminUser();
  });
  request.fail(function(jqXHR, textStatus, errorThrown)
  {
      $("#message").text(textStatus);
      console.log("fail object ", jqXHR);
      console.log("error thrown ", errorThrown);
  });
}
//edit
$(document).on("click", ".editBtn", function()
{
  $("#stateForm").show(1000);
  $("#uid").val($(this).attr("id"));
  $("#loginid").val($(this).attr("login"));
  $("#fname").val($(this).attr("fname"));
  $("#lname").val($(this).attr("lname"));
  $("#group").val($(this).attr("group"));
  $("#addBtn").hide();
  $("#updBtn").show();
});

/*============== Help function ======================*/
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

/*====================Dailog==========================*/
function closeForm() {
    modal.style.display = "none";
}

$("#nBtn").click(function(){
	closeForm();
});

$("#yBtn").click(function(){
  console.log("dele dailog");
  sendCommand("deleteUser");  
	closeForm();
});