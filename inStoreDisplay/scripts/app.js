$(function() {
	console.log("app ready");

	window.setInterval(update, config["updateInterval"]);

	var background = $("div#background");
	var welcome = $("div#welcome");
	var productInfo = $("div#productInfo");
	var activeView;
	var animationLock = null;

	function update() {
	}

	function getBlur(t) {
		var blur = config['productInfoBackgroundBlur']  * t;
		return 'blur(' + blur + 'px)';
	}


	function canChangeView(view) {
		if(animationLock !== null) return false;  

		// dont animate view if already shown
		if(activeView === view) return false;
		// register view as active
		activeView = view;
		// set animation lock
		animationLock = view;
		return true;
	}

	function showWelcomeScreen() {
		if(!canChangeView(welcome)) return;
		console.log("showWelcomeScreen");

		welcome.show();
		productInfo.hide();

		$({ t:0 }).animate( { t:1 }, {
			duration: config['changePageDuration'],
			step: function(now,fx) {
				background.css('filter', getBlur(1 - now)); 
			},
			complete: function() {
				background.css('filter', getBlur(0)); 
				animationLock = null;
			}
		});
	}

	function showProductInfo() {
		if(!canChangeView(productInfo)) return;
		console.log("showProductInfo");

		welcome.hide();
		productInfo.show();

		$({ t:0 }).animate( { t:1 }, {
			duration: config['changePageDuration'],
			step: function(now,fx) {
				background.css('filter', getBlur(now)); 
			},
			complete: function() {
				background.css('filter', getBlur(1)); 
				animationLock = null;
			}
		});
	}

	showWelcomeScreen();

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
