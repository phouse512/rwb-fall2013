//
// Global state
//
// map     - the map object
// usermark- marks the user's position on the map
// markers - list of markers on the current map (not including the user position)
// 
//

//
// First time run: request current location, with callback to Start
//
if (navigator.geolocation)  {
    navigator.geolocation.getCurrentPosition(Start);
}


function UpdateMapById(id, tag) {

    var target = document.getElementById(id);
    var data = target.innerHTML;

    var rows  = data.split("\n");
   
    for (i in rows) {
	var cols = rows[i].split("\t");
	var lat = cols[0];
	var long = cols[1];

	markers.push(new google.maps.Marker({ map:map,
						    position: new google.maps.LatLng(lat,long),
						    title: tag+"\n"+cols.join("\n")}));
	
    }
}

function ClearMarkers()
{
    // clear the markers
    while (markers.length>0) { 
	markers.pop().setMap(null);
    }
}


function UpdateMap()
{
    var color = document.getElementById("color");
    
    color.innerHTML="<b><blink>Updating Display...</blink></b>";
    color.style.backgroundColor='white';

    ClearMarkers();

    if($("#committees").attr("checked")) {
	UpdateMapById("committee_data","COMMITTEE");
	var committeeDifference = $("input[name='diff_money_c']").attr("value");
	var committeeTotal = $("input[name='total_c']").attr("value");
	 $(".committeeResults").html("Spending total: $" + committeeTotal);
	   

	if (committeeDifference > 0){
	   // $(".committeeResults").html("Spending difference: $" + committeeDifference);
	    $(".committeeResults").css("background-color", "#A3C2FF");    
	} else if (committeeDifference == 0){ 
	   // $(".committeeResults").html("Neutral spending");
	    $(".committeeResults").css("background-color", "#B7B7B7");
	} else {
	   // $(".committeeResults").html("Spending difference: $" + Math.abs(committeeDifference));
	    $(".committeeResults").css("background-color", "#FF6666");
	}
    }
    if($("#candidates").attr("checked")) {
	 UpdateMapById("candidate_data","CANDIDATE");
    }
    if($("#individuals").attr("checked")) {    
	UpdateMapById("individual_data", "INDIVIDUAL");

	var individualDifference = $("input[name='diff_money_i']").attr("value");
	var individualTotal = $("input[name='total_i']").attr("value");
	$(".individualResults").html("Spending total: $" + individualTotal);
	 
	if (individualDifference > 0){
//	    $(".individualResults").html("Spending difference: $" + individualDifference);
	    $(".individualResults").css("background-color", "#A3C2FF");
	} else if (individualDifference == 0){
//	    $(".individualResults").html("Neutral spending");
	    $(".individualResults").css("background-color", "#B7B7B7");
	} else {
//	    $(".individualResults").html("Spending difference: $" + Math.abs(individualDifference));
	    $(".individualResults").css("background-color", "#FF6666");
	}
    }  
    if($("#opinions").attr("checked")) {
	UpdateMapById("opinion_data","OPINION");
        
	var opinionAvg = $("input[name='oavg']").attr("value");
	var opinionStd = parseFloat($("input[name='ostd']").attr("value")).toPrecision(5);

	if(opinionAvg > 0){
	    $(".opinionResults").css("background-color", "#A3C2FF");
	} else if (opinionAvg == 0) {
	    $(".opinionResults").css("background-color", "#B7B7B7");
	} else {
	    $(".opinionResults").css("background-color", "#FF6666");
	}

	console.log(opinionAvg + " " + opinionStd);
	$(".opinionResults").html("Opinion Average: " + opinionAvg + " Std: " + opinionStd);
    }

    color.innerHTML="Ready";
   
    //if (Math.random()>0.5) { 
    //	color.style.backgroundColor='blue';
    //} else {
    //	color.style.backgroundColor='red';
    //}

}

function NewData(data)
{
  var target = document.getElementById("data");
  
  target.innerHTML = data;

  UpdateMap();

}

function getLocation() {
    if (navigator.geolocation){
	 navigator.geolocation.getCurrentPosition(hiddenLocation)
    }
}

function getDemocrat() {
  $.get('comm_money.pl', displayCommitteeMoney);
}

function displayCommitteeMoney(data){
  console.log(data);
}

function hiddenLocation(location){
    var longitude = location.coords.longitude;
    var latitude = location.coords.latitude;
    console.log(longitude + " " + latitude);
    $("p").first().prepend("<input type=\"hidden\" name=\"lat\" value=\"" + latitude + "\"><input type=\"hidden\" name=\"long\" value=\"" + longitude + "\">");
}

function ViewShift()
{
    var bounds = map.getBounds();

    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var color = document.getElementById("color");

    color.innerHTML="<b><blink>Querying...("+ne.lat()+","+ne.lng()+") to ("+sw.lat()+","+sw.lng()+")</blink></b>";
    color.style.backgroundColor='white';

    var checked = new Array();
    $(".what:checked").each(function() {
   	checked.push($(this).attr("val"));
    });
   
    var formatString = "&what=";

    for(var i=0; i<checked.length; i++){
	formatString += checked[i];
	if (i != (checked.length-1)){
	    formatString += ",";
	}
    }   

    console.log(formatString);
    var cycleString = getCyclesQuery();
    console.log(cycleString);
 
    // debug status flows through by cookie
    $.get("rwb.pl?act=near&latne="+ne.lat()+"&longne="+ne.lng()+"&latsw="+sw.lat()+"&longsw="+sw.lng()+"&format=raw" + formatString + cycleString, NewData);
}

function getCycles()
{
  $.get("get_cycles.pl", displayCycles);
}

function displayCycles(data) {
    console.log(data);

    var years = data.getElementsByTagName("year");
    var html = "";

    for(var i=0; i<years.length; i++){
	currentYear = years[i].textContent;
        currentYearView = currentYear.substr(0, 2) + '-' + currentYear.substr(2);
	html += "<input type='checkbox' class='selectYear' val='" + currentYear + "'>" + currentYearView + "</input>";
    }
    $("#chooseYear").html(html);
    $(".selectYear[val='1112']").attr("checked", "checked"); 
}

function getCyclesQuery() {
    var checked = new Array();
    $(".selectYear:checked").each(function() {
	checked.push($(this).attr("val"));
    });

    var cycleString = "&cycle=";
    for(var i=0; i<checked.length; i++){
	cycleString += checked[i];
	if (i != (checked.length-1)){
	    cycleString += ",";
	}
    }
/*
    var cycleString = "(";
    for (var i=0; i<checked.length; i++){
	cycleString += "cycle=" + checked[i];
	if (i != (checked.length-1)) {
	   cycleString += " OR ";
	} 
    }
    cycleString += ")";

    if(cycleString == "()"){
	cycleString = "";
    }*/
    return cycleString;
}

function Reposition(pos)
{
    var lat=pos.coords.latitude;
    var long=pos.coords.longitude;

    map.setCenter(new google.maps.LatLng(lat,long));
    usermark.setPosition(new google.maps.LatLng(lat,long));
}


function Start(location) 
{
  var lat = location.coords.latitude;
  var long = location.coords.longitude;
  var acc = location.coords.accuracy;


  var mapc = $( "#map");

  map = new google.maps.Map(mapc[0], 
			    { zoom:16, 
				center:new google.maps.LatLng(lat,long),
				mapTypeId: google.maps.MapTypeId.HYBRID
				} );

  usermark = new google.maps.Marker({ map:map,
					    position: new google.maps.LatLng(lat,long),
					    title: "You are here"});

  markers = new Array;

  var color = document.getElementById("color");
  color.style.backgroundColor='white';
  color.innerHTML="<b><blink>Waiting for first position</blink></b>";

  google.maps.event.addListener(map,"bounds_changed",ViewShift);
  google.maps.event.addListener(map,"center_changed",ViewShift);
  google.maps.event.addListener(map,"zoom_changed",ViewShift);

  navigator.geolocation.watchPosition(Reposition);

}


