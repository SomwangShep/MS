//======================= modal======================================
var dailogModel=[];
var modal = document.getElementById('dlogs');
var tit = "";
// Get the <span> element that closes the modal
//var span = document.getElementsByClassName("close")[0];
//======================= view ======================================
function updateViewDailog()
{
	if (dailogModel.error != undefined){}
	else if(dailogModel.notFound != undefined){}
	else
	{
		var t = 0;
		$("#dailogTableBody").empty();
		for (var i in dailogModel)
		{
			var row = dailogModel[i];
			t = t + parseInt(row.TmSp);
			$("#dailogTableBody").append("<tr>"+
				"<td>"+row.Dts+"</td>"+
				"<td>"+row.Ttl + "</td>" +
				"<td>"+secondsConvert(row.TmSp) +"</td>" +
				"</tr>");
		}
		$("#mTitle").text(tit + " transaction(s)");
		$("#dMessage").html("Total:" + secondsConvertRP(t));
		
	}
}

//===================== controller===================================
//click on star
$(document).on("click", ".dlog", function()
{
	
	var wk = $(this).attr('id');
	tit= $(this).attr('id');
	$("#weekN").val($(this).attr("id"));
	sendCommandDailog("dailogReport");
	modal.style.display = "block";
	console.log("daliog");
	console.log(wk);
});


function sendCommandDailog(cmd)
{
	var url = "MSVideo.php?cmd="+cmd;
	var data = $("#stateForm" ).serialize();
    var request = $.post(url, data);
    request.done(function(json)
    {
        console.log(json);
        dailogModel = json;
        updateViewDailog();
    });
    request.fail(function(jqXHR, textStatus, errorThrown)
    {
        $("#message").text(textStatus);
        console.log("fail object ", jqXHR);
        console.log("error thrown ", errorThrown);
        updateViewDailog();
    });
}            

// When the user clicks on <span> (x), close the modal
/*
span.onclick = function() {
    modal.style.display = "none";
}*/

function closeForm() {
    modal.style.display = "none";
}

$("#cl").click(function(){
	closeForm();
});

$("#closeBtn").click(function(){
	closeForm();
});

/*
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}*/