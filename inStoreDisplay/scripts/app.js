$(function() {
	/*
	$.getJSON("data-from-to/product-info.json", function(json) {
		    console.log(json); // this will show the info it in firebug console
	});
	*/

	console.log(products.length + " products defined");

	var chart = new Chart();
	chart.init();

	console.log("app ready");

	window.setInterval(update, config["updateInterval"]);

	var background = $("div#background");

	var welcome = $("div#welcome");
	welcome.logo = welcome.find("div#logo");

	var productInfo = $("div#productInfo");
	productInfo.panel = productInfo.find("div#panel");

	var activeView;
	var animationLock = null;

	// PRODUCT INFO
	var productName = $("#ProductName");
	var teaser = $("#Teaser");
	var productImage = $("#ProductImage");
	var processLine = $("#ProcessLine");

	function update() {
	}

	function getBlur(t) {
		var blur = config['productInfoBackgroundBlur']  * t;
		return 'blur(' + blur + 'px)';
	}

	function getPixels(t) {
		return t + "px";
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

		hideProductInfo(function() {

			welcome.show();

			// effects
			var logoOutDuration = 200;
			var logoMarginTop = config['logoMarginTop'];

			$(welcome.logo).animate({
				marginTop: logoMarginTop
			}, logoOutDuration, null);


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
		});


	}

	function HideWelcomeScreen(onComplete) {
		var logoOutDuration = 200;

		// effects
		$(welcome.logo).animate({
			marginTop: "-500px"
		}, logoOutDuration, null);


		// main animation
		$({ t:0 }).animate( { t:1 }, {
			duration: config['changePageDuration'],
			step: function(now,fx) {
				background.css('filter', getBlur(now)); 
			},
			complete: function() {
				background.css('filter', getBlur(1)); 
				animationLock = null;
				welcome.hide();
				onComplete();
			}
		});
	}

	function showProductInfo() {
		if(!canChangeView(productInfo)) return;
		console.log("showProductInfo");

		// hacky and hardcoded stuff
		HideWelcomeScreen( function() {

			productInfo.show();
			chart.show();

			// effects 
			var panelSize = productInfo.panel.css('width');
			console.log(panelSize);
			var panelDuration = 200;
			// hide panel
			productInfo.panel.css('margin-left', "-" + panelSize);
			
			$(productInfo.panel).animate({
				marginLeft: getPixels(0)
			}, panelDuration, null);

		});
	}

	function hideProductInfo(onComplete) {
		console.log("hide product info");
		if(productInfo.css('display') === 'none') { 
			onComplete();
			return;
		}

		// effects
		chart.hide();

		// main animation
		$({ t:0 }).animate( { t:1 }, {
			duration: config['changePageDuration'],
			step: function(now,fx) {
			},
			complete: function() {
				productInfo.hide();
				onComplete();
			}
		});
	}

	productInfo.hide();
	welcome.hide();
	
	showWelcomeScreen();

	function loadProductToView(product) {
		console.log(product);
		var IMG_FOLDER = "css/";
		productName.html(product.ProductName);	
		teaser.html(product.Teaser);	
		productImage.attr("src", IMG_FOLDER + product.img["@src"]);
		var MAX_PROCESSES = 1;
		for(var i=0; i < MAX_PROCESSES; i++) {
			var process = processLine.find("div#Process" + i);
			var description = process.find("span.ProcessDescription");
			var image = process.find("img.ProcessImg");
			description.html(product.ProcessLine.Process[i]["@name"]);
			image.attr("src", IMG_FOLDER + product.ProcessLine.img[i]["@src"]);
		}
	}
	
	function showProduct(id) {
		console.log("requesting product " + id);
		var product = products[id];
		loadProductToView(product);
	}

	document.addEventListener('keydown', 
		function(event) {     
			if(event.keyCode == 65) {         
				showWelcomeScreen();
			} else if(event.keyCode == 83) {         
				showProductInfo();     
			} else if(event.keyCode == 82) {         
				location.reload();
			}
			var offset = 48;
			for(var i=0; i<10;i++) {
				if(event.keyCode == i + offset) {
					showProduct(i);
					break;
				}
			}
		}

	);
});
