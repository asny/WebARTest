
function ChartEntry (magnitude, title) { 
	this.magnitude = magnitude;
	this.title = title;
}

function Chart () {

	var context; 

	this.init = function() {
	};

	this.draw = function() {

		var canvas = document.getElementById('chartCanvas');
		var context = canvas.getContext('2d');

		var centerX = canvas.width / 2;
		var centerY = canvas.height / 2;



		var entries = [
			new ChartEntry(0.5, "Water consumption"),
			new ChartEntry(0.9, "Certifications"),
			new ChartEntry(0.3, "Certifications"),
			new ChartEntry(0.4, "Water consumption")
		];

		var radius = 30;
		var radiusDelta = 60;
		var lineWidth = 20;
		for(var entry in entries) {
			this.drawArc(context, centerX, centerY, radius, lineWidth, entries[entry]);
			radius += radiusDelta;
		}
	};

	this.drawArc = function(context, centerX, centerY, radius, lineWidth, entry) {

		context.beginPath();
		var start = -Math.PI * 0.5;
		var MAX = Math.PI * 2 * 0.8;
		var length = MAX *  entry.magnitude + start;
		console.log(entry);
		context.arc(centerX, centerY, radius, -Math.PI * 0.5, length, false);
		//context.fillStyle = 'transparent';
		//context.fill();
		context.lineWidth = lineWidth;
		context.strokeStyle = 'rgba(255,255,255,255)';
		context.stroke();

	};

	
}



