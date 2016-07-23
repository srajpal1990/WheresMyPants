$(function() {
//Set up variables
var socket;
var userLocDetails;
var pantLocDetails;
var map;


//Initialize
init();


/**FUCNTIONS**/

/**
*Initialize variables and UI
**/
function init(){
	//Connect to socket
	socket = io();

	//Initialize LED config to all red
	var bitCount=0;
	$('#led').children().each(function () {
		setBit(bitCount,true);
		bitCount++;
	});


	/**SET UP LISTENERS**/

	//Get location from browser 
	$('#updateLocBtn').click(function(){
		console.log("update loc btn click");
		getLocation();
	});

	//Initialize Google Maps when modal cheat window is shown.
	$('#myModal').on("shown.bs.modal", function () {

		//get the base url to access server stored icons for markers.
		var curDomain=getCurDomain();

		//Initialize map centered on users location.
		var map = new google.maps.Map(document.getElementById('map'), {
			center: userLocDetails,
			zoom: 14
		});

		//Show user marker on map.
		var userMarker = new google.maps.Marker({
			position: userLocDetails,
			map: map,
			draggable:true,
			icon:curDomain+"/images/user.png"

		});

		//Show pants marker on map.
		var pantsMarker = new google.maps.Marker({
			position: pantLocDetails,
			map: map,
			icon:curDomain+"/images/pantsInJailSmall.png"

		});

		//Listen for drag end event on user marker (Used to fake the users position)
		google.maps.event.addListener(userMarker, "dragend", function(event) {
			userLocDetails={
				lng:event.latLng.lng(),
				lat:event.latLng.lat(),
			};

			//Request LED config update based on fake location update details recieved.
			socket.emit('updateLocation',userLocDetails);

		});



	});

	//Recieve and save the location of the pants to allow cheating.
	socket.on('pantLoc',function(pantLoc){
		pantLocDetails=pantLoc;
	});

	//Recieve updated LED config and update UI
	socket.on('updateLed',function(updatedLedCount){
		clearDisplay();//Clear current LED config

		bitCount=0;
		$('#led').children().each(function () {
			setBit(bitCount,bitCount<updatedLedCount);
			bitCount++;
		});

		//When user is close to pants location redirect to found pants page.
		if(updatedLedCount===0){
			window.location.href="/foundPants";
		}

	});

	//Request users current location from browser.
	getLocation();

}

/**
*Requests user browser for access to location details
**/
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(useLocation);
	} else {
		alert("Geolocation is not supported by this browser.");
	}
}

/**
*Returns current base domain i.e if current url is http://localhost:3000/findMyPants
*function will return http://localhost:3000.
**/
function getCurDomain(){
	var url = window.location.href;
	var arr = url.split("/");
	var baseDomain = arr[0] + "//" + arr[2];
	return baseDomain;
}

/**
*Called when location is retrieved from browser.
*emits a update location event to request updated LED config.
**/
function useLocation(position) {

	userLocDetails={
		lng:position.coords.longitude,
		lat:position.coords.latitude,
	};

	socket.emit('updateLocation',userLocDetails);
}

// Display a bit on the LED display
function setBit(bit, on) {
	if (on) {
		$("#bit"+bit).css("background-color","Red");
	} else {
		$("#bit"+bit).css("background-color","LimeGreen");
	}
}

// Display a byte on the LED display
function displayChar(ch) {
		// console.log("Key: " + String.fromCharCode(ch) + "[" + ch + "]");
		setBit(7, (ch & 0x80) > 0);
		setBit(6, (ch & 0x40) > 0);
		setBit(5, (ch & 0x20) > 0);
		setBit(4, (ch & 0x10) > 0);
		setBit(3, (ch & 0x08) > 0);
		setBit(2, (ch & 0x04) > 0);
		setBit(1, (ch & 0x02) > 0);
		setBit(0, (ch & 0x01) > 0);
	}

// Clears the display back to grey
function clearDisplay() {
	$(".bitbtn").css("background-color","LightGray");
}



});

/**
*Initialize google map.
*NOTE: as our map is placed within a dynamic element it will need to be
*reinitialized when element becomes visible as has been done above.
**/
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 8
	});
}