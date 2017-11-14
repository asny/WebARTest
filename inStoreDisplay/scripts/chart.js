
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

	};

	this.show = function() {
		this.animate(0,1);
	};

	this.hide = function() {
		this.animate(1,0);
	};

	this.animate = function(from, to) {

		var duration = 1000;
		var o = this;

		$({ t:from }).animate( { t:to }, {
			duration: duration,
			step: function(now,fx) {
				o.drawEntries(o.entries, now);
			},
			complete: function() {
				o.drawEntries(o.entries, 1);
			}
		});
	}

	this.drawEntries = function(entries, t) {

		var canvas = document.getElementById('chartCanvas');
		var context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);

		var centerX = canvas.width / 2;
		var centerY = canvas.height / 2;

		var radius = 30;
		var radiusDelta = 60;
		var lineWidth = 20;
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



