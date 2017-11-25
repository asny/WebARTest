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
	var currentProductId = 0;

	// PRODUCT INFO
	var productName = $("#ProductName");
	var productTitle = $("#ProductTitle");
	var teaser = $("#Teaser");
	var productImage = $("#ProductImage");
	var processLine = $("#ProcessLine");
	var certifications = $("#Certifications");
	var certificationContainers;

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
				marginTop: logoMarginTop,
				zoom : "1"
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
			marginTop: "100px",
			zoom: "0.5"
		}, logoOutDuration, null);


		// main animation
		$({ t:0 }).animate( { t:1 }, {
			duration: config['changePageDuration'],
			step: function(now,fx) {
				background.css('filter', getBlur(now)); 
			},
			complete: function() {
				background.css('filter', getBlur(1)); 
				//welcome.hide();
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
		if(!canLockAnimation(productInfo)) return;
		activeView = productInfo;
		console.log("showProductInfo");

		var product = products[currentProductId];

		var doShowProductView = function() {
			productInfo.show();
			productInfo.css('opacity', 1);

			// effects, hacky, should use futures
			var totalDuration = config['showProductViewDuration'];
			var panelDuration = totalDuration * 0.2;
			var chartDuration = totalDuration * 0.2;
			var certificationsDuration = totalDuration * 0.6;
			var processDuration = totalDuration * 0.5;
			hideProductInfoWithLeftMarginOffset();

			var finalize = function() {
				freeAnimationLock(productInfo);
			}

			var showChart = function() {
				chart.show(chartDuration);
			};

			var init = function() {

				for(var i = 0; i < certificationContainers.length; i++) { 
					certificationContainers[i].hide();
				}
			}

			var showPanel = function() {
				$(productInfo.panel).animate({
					marginLeft: getPixels(0)}, 
					panelDuration, null);
			}

			var showCertifications = function() {
				var itemDuration = certificationsDuration / certificationContainers.length;

				var showCertification = function(certification, delay) {
					setTimeout(function() { certification.fadeIn(400); }, delay);
				};

				for(var i = 0; i < certificationContainers.length; i++) { 
					var certification = certificationContainers[i];

					showCertification(certification, itemDuration * i);
				}
			}


			for(var i = 0; i < activeProcesses.length; i++) {
				activeProcesses[i].css('opacity', '0.0');
			}

			var showProcessLine = function() {
				var fadeIn = processDuration * 0.5;
				var delta = fadeIn / activeProcesses.length;
				console.log("this is delta " + delta);

				var showProcess = function(delayVal, process) {
					$(process).delay(delayVal).animate( {
						opacity:1.00
					}, fadeIn, null);
				}

				for(var i = 0; i < activeProcesses.length; i++) {
					var process = activeProcesses[i];
					var delay = delta * i;
					showProcess(delay, process);
				} 				
			};


			// start and stop behaviour
			init();
			setTimeout(finalize, totalDuration);

			// keep track of how far into the animation flow we are
			var animationOffset = 0;

			// panel
			setTimeout(showPanel, animationOffset);
			animationOffset += panelDuration;

			// chart
			setTimeout(showChart, animationOffset);
			animationOffset += chartDuration; 

			setTimeout(showCertifications, animationOffset);
			animationOffset += certificationsDuration;
			
			// very done. finalize callback will handle clean up.

		
			//animationOffset += processDuration; 
			//setTimeout(showProcessLine, animationOffset);

			
			/*
			$(productInfo.panel).animate({
				marginLeft: getPixels(0)}, 
				panelDuration, 
				showChart);
				*/
		}

		// hacky and hardcoded stuff
		if(alreadyAtProductInfo) {
			flipProductInfo( function() {
				loadProductToView(product);
				doShowProductView();
			});
		} else {
			loadProductToView(product);
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

		var duration = config['hideProductViewDuration'];

		// main animation
		$({ t:0 }).animate( { t:1 }, {
			duration: duration,
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
	var activeProcesses = [];
	

	function loadProductToView(product) {
		var IMG_FOLDER = "css/";
		productTitle.html(product.ProductTitle);
		productName.html(product.ProductName);	
		teaser.html(product.Teaser);	
		productImage.attr("src", IMG_FOLDER + product.img["@src"]);

		// process
		var MAX_PROCESSES = 10;
		var length = product.ProcessLine.Process.length;

		activeProcesses.length = 0;

		for(var i=0; i < MAX_PROCESSES; i++) {

			var process = processLine.find("div#Process" + i);
			var description = process.find("span.ProcessDescription");
			var image = process.find("img.ProcessImg");
			if( i >= length) {
				process.hide();
			} else {
				activeProcesses.push(process);
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
		certificationContainers = [];

		for(var i=0; i < MAX_CERTIFICATIONS; i++) {
			var certification = certifications.find("div#Certification" + i);
			if(i >= length) {
				certification.hide();
			} else {
				certification.show();
				certification.html(certificationsData[i]);	
				certificationContainers.push(certification);
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
			var name = effects[i]["@name"];
			// we need normalized value
			percentage /= 100;

			chart.entries[i] = new ChartEntry(percentage, name);
		}

			

	}

	
	function showProduct(id) {
		// if something else is currently animation, do nothing
		if(animationLock !== null) {
			return;
		}
		// if we are already at the productInfo screen AND showing
		// the requested product id, we also do nothin
		if(activeView === productInfo && currentProductId == id) {
			return;
		}

		console.log("requesting product " + id);
		currentProductId = id;
		showProductInfo();
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
