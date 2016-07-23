var socket = io();

init();


function init(){
	
	var bitCount=0;
	$('#led').children().each(function () {
		setBit(bitCount,false);
		bitCount++;
	});



	socket.on('updateLed',function(updatedLedCount){

		console.log("updateLed count "+updatedLedCount);

	});

	getLocation();

}

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		alert("Geolocation is not supported by this browser.");
	}
}
function showPosition(position) {
	console.log("Latitude: " + position.coords.latitude + 
		"Longitude: " + position.coords.longitude); 
	var locDetails={
		lon:position.coords.longitude,
		lat:position.coords.latitude,
		numLedActive:0
	};
	socket.emit('updateLocation',locDetails);
}

