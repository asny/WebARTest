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
	var certifications = $("#Certifications");

	function update() {
	}

	function getBlur(t) {
		var blur = config['productInfoBackgroundBlur']  * t;
		return 'blur(' + blur + 'px)';
	}

	function getPixels(t) {
		return t + "px";
	}

	function canLockAnimation(view) {
		if(animationLock !== null) return false;  

		// dont animate view if already shown
		//if(activeView === view) return false;

		// register view as active
	//	activeView = view;
		// set animation lock
		animationLock = view;
		return true;
	}

	function freeAnimationLock(view) {
		if(animationLock !== view) {
			console.log("trying to free lock that is not owned. Not cool.");
		}
		animationLock = null;



	}

	function showWelcomeScreen() {
		console.log("want to show welcome screen");
		if(!canLockAnimation(welcome)) return;
		console.log("showWelcomeScreen");
		activeView = welcome;

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
					freeAnimationLock(welcome);
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
				welcome.hide();
				onComplete();
			}
		});
	}

	function hideProductInfoWithLeftMarginOffset() {
		var panelSize = productInfo.panel.css('width');
		// hide panel
		productInfo.panel.css('margin-left', "-" + panelSize);
	}

	function showProductInfo() {
		var alreadyAtProductInfo = activeView === productInfo;
		console.log(alreadyAtProductInfo + "OMGOMGOMG");
		if(!canLockAnimation(productInfo)) return;
		activeView = productInfo;
		console.log("showProductInfo");

		var doShowProductView = function() {
			productInfo.show();
			productInfo.css('opacity', 1);
			chart.show();

			// effects 
			var panelDuration = config['showProductViewDuration'];
			hideProductInfoWithLeftMarginOffset();
			
			$(productInfo.panel).animate({
				marginLeft: getPixels(0)}, 
				panelDuration, 
				function() { freeAnimationLock(productInfo);  } );
		}

		// hacky and hardcoded stuff
		if(alreadyAtProductInfo) {
			flipProductInfo( doShowProductView );
		} else {
			HideWelcomeScreen( doShowProductView );
		}


	}

	function flipProductInfo(callback) {
		hideProductInfo(callback);
	}


	function hideProductInfo(onComplete) {
		console.log("hide product info");
		if(productInfo.css('display') === 'none') { 
			onComplete();
			return;
		}

		// effects
		chart.hide(config['changePageDuration'] * 0.5);

		// main animation
		$({ t:0 }).animate( { t:1 }, {
			duration: config['changePageDuration'],
			step: function(now,fx) {
				productInfo.css('opacity', 1-now);
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

		// process
		var MAX_PROCESSES = 10;
		var length = product.ProcessLine.Process.length;
		for(var i=0; i < MAX_PROCESSES; i++) {

			var process = processLine.find("div#Process" + i);
			var description = process.find("span.ProcessDescription");
			var image = process.find("img.ProcessImg");
			if( i >= length) {
				process.hide();
			} else {
				process.show();
				description.html(product.ProcessLine.Process[i]["@name"]);
				image.attr("src", IMG_FOLDER + product.ProcessLine.img[i]["@src"]);
			}
		}

		// certifications
		var MAX_CERTIFICATIONS = 5;
		var certificationsData;
		// sometimes product.Certification is an object, sometimes  a list. This is a hacky
		// chaos that deals with this madness. yes . 
		if(product.Certification.length === undefined) {
			certificationsData = [ product.Certification.Certificate];
		} else { 
			certificationsData = product.Certification;
		}
		length = certificationsData.length;
		console.log(length);
		for(var i=0; i < MAX_CERTIFICATIONS; i++) {
			var certification = certifications.find("div#Certification" + i);
			if(i >= length) {
				certification.hide();
			} else {
				certification.show();
				certification.html(certificationsData[i]);	
				console.log(certificationsData[i]);
			}
		}

		// chart entries
		var MAX_ENTRIES = 3;
		var effects = product.EnvironmentalEffects.effect; 
		var length = effects.length;
		// clear current entries
		chart.entries = [];

		for(var i=0; i < length; i++) {
			// has a percentage at the end, which we slice away
			var percentage = effects[i]["#text"].slice(0,-1);
			// we need normalized value
			percentage /= 100;

			chart.entries[i] = new ChartEntry(percentage, "omg");
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
