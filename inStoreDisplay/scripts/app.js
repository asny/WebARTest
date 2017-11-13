$(function() {

	console.log("app ready");

	window.setInterval(update, config["updateInterval"]);

	var welcome = $("div#welcome");
	var productInfo = $("div#productInfo");

	function update() {
	}

	function showWelcomeScreen() {
		console.log("hide");
		welcome.show();
		productInfo.hide();
	}

	function showProductInfo() {
		console.log("show");

		welcome.hide();
		productInfo.show();
	}

	document.addEventListener('keydown', 
		function(event) {     
			if(event.keyCode == 65) {         
				showWelcomeScreen();
			} else if(event.keyCode == 83) {         
				showProductInfo();     
			} 
		}
	);



});
