
function ChartEntry (magnitude, title) { 
	this.magnitude = magnitude;
	this.title = title;
}

function Chart () {

	this.entries = [
		new ChartEntry(0.5, "Water consumption"),
		new ChartEntry(0.9, "Certifications"),
		new ChartEntry(0.3, "Certifications"),
		new ChartEntry(0.4, "Water consumption")
	];
	
	this.init = function() {
		this.label0 = $("div#chart li.0");	
		this.label1 = $("div#chart li.1");	
		this.label2 = $("div#chart li.2");	

		this.label0.hide();
		this.label1.hide();
		this.label2.hide();

	};

	this.hideLabels = function(){
		this.label0.fadeOut(0);
		this.label1.fadeOut(0);
		this.label2.fadeOut(0);
	}

	this.show = function(duration, callback) {
		if(duration == null) {
			console.log(duration);
			console.log("No duration for graph.show!");
		}
		this.animate(0,1, duration, callback);

		this.label0.html(this.entries[0].title);
		this.label1.html(this.entries[1].title);
		this.label2.html(this.entries[2].title);


		var duration = 200;
		var offset = 500;
		var total = 400;
		this.label0.delay(offset + 0).fadeIn(200);
		this.label1.delay(offset + 200).fadeIn(200);
		this.label2.delay(offset + 400).fadeIn(200);
	};

	this.hide = function(duration) {
		this.animate(1,0, duration);
		this.hideLabels();
	};

	this.animate = function(from, to, duration, callback) {
		var o = this;

		$({ t:from }).animate( { t:to }, {
			duration: duration,
			step: function(now,fx) {
				o.drawEntries(o.entries, now);
			},
			complete: function() {
				o.drawEntries(o.entries, to);
				if(callback != null) {
					callback();
				}
			}
		});
	}

	this.drawEntries = function(entries, t) {

		var canvas = document.getElementById('chart').getElementsByTagName('canvas')[0];
		var context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);

		var centerX = canvas.width / 2;
		var centerY = canvas.height / 2;

		var radius = 60;
		var radiusDelta = 60;
		var lineWidth = 40;
		for(var entry in entries) {
			var magnitude = entries[entry].magnitude * t;
			this.drawArc(context, centerX, centerY, radius, lineWidth, magnitude, t);
			radius += radiusDelta;
		}
	}

	this.drawArc = function(context, centerX, centerY, radius, lineWidth, magnitude, t) {

		context.beginPath();
		var start = -Math.PI * 0.5;
		var MAX = Math.PI * 2 * 0.75;
		var length = MAX *  magnitude + start;
		context.arc(centerX, centerY, radius, start, length, false);
		//context.fillStyle = 'transparent';
		//context.fill();
		context.lineWidth = lineWidth;
		context.strokeStyle = 'rgba(255,255,255,255)';
		context.stroke();

		context.beginPath();
		context.arc(centerX, centerY, radius, start, MAX+start, false);
		context.lineWidth = lineWidth;
		var alpha = 0.1 * t;
		context.strokeStyle = 'rgba(255,255,255,' + alpha + ')';
		context.stroke();

	};
}



