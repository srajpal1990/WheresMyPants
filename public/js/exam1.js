$(function() {
	var socket = io();

	init();
	var userLocDetails;
	var pantLocDetails;

	function init(){

		var bitCount=0;
		$('#led').children().each(function () {
			setBit(bitCount,true);
			bitCount++;
		});

		$('#updateLocBtn').click(function(){
			console.log("update loc btn click");
			getLocation();
		});

		$('#myModal').on("shown.bs.modal", function () {
			var pos = {
				lat: userLocDetails.lat,
				lng:userLocDetails.lon
			};

			var pos2 = {
				lat: userLocDetails.lat+0.005,
				lng:userLocDetails.lon
			};

			map = new google.maps.Map(document.getElementById('map'), {
				center: pos2,
				zoom: 14
			});
			var url = window.location.href
			var arr = url.split("/");
			var result = arr[0] + "//" + arr[2]
			console.log();

			var marker = new google.maps.Marker({
				position: pos,
				map: map,
				draggable:true,
				icon:result+"/images/user.png"

			});

			var marker2 = new google.maps.Marker({
				position: pantLocDetails,
				map: map,
				icon:result+"/images/pantsInJailSmall.png"

			});

			google.maps.event.addListener(marker, "dragend", function(event) { 
				console.log("drag end");
				userLocDetails={
					lon:event.latLng.lng(),
					lat:event.latLng.lat(),
					numLedActive:0
				};
				socket.emit('updateLocation',userLocDetails);
				 
			});
			

			
		})

socket.on('pantLoc',function(pantLoc){
	console.log(pantLoc);
	pantLocDetails=pantLoc;
});

socket.on('updateLed',function(updatedLedCount){
	clearDisplay();
	bitCount=0;
	console.log("updateLed count "+updatedLedCount);
	$('#led').children().each(function () {
		setBit(bitCount,bitCount<updatedLedCount);
		bitCount++;
	});

	if(updatedLedCount==0){
		window.location.href="/foundPants"
	}

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
	userLocDetails={
		lon:position.coords.longitude,
		lat:position.coords.latitude,
		numLedActive:0
	};
	socket.emit('updateLocation',userLocDetails);
}
	// Display a bit on the LED display
	function setBit(bit, on) {
		if (on) {
			$("#bit" + bit).css("background-color", "Red");		
		} else {
			$("#bit" + bit).css("background-color", "LimeGreen");		
		}
	}

	// Display a byte on the LED display
	function displayChar(ch) {
		// console.log("Key: " + String.fromCharCode(ch) + "[" + ch + "]");
		setBit(7, (ch & 0x80) > 0)
		setBit(6, (ch & 0x40) > 0)
		setBit(5, (ch & 0x20) > 0)
		setBit(4, (ch & 0x10) > 0)
		setBit(3, (ch & 0x08) > 0)
		setBit(2, (ch & 0x04) > 0)
		setBit(1, (ch & 0x02) > 0)
		setBit(0, (ch & 0x01) > 0)
	}

	// Clears the display back to grey
	function clearDisplay() {
		$(".bitbtn").css("background-color", "LightGray");		
	}

	// Animate the string into the LED display
	$("#go").click(function() {

		var pos = 0;
		var msg = $("#keyboard").val();
		clearDisplay();
		if (msg.length == 0) return;
		var interval = setInterval(function() {
			var ch = msg.charCodeAt(pos);
			if (pos++ >= msg.length) {
				clearInterval(interval);
				clearDisplay();
			} else {
				displayChar(ch);
			}
		}, 1000)

		return false;
	});

})

var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 8
	});
}