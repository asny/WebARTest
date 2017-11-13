var config = {};
config["updateInterval"] = 500; // miliseconds

console.log("registered config");
for(var key in config) {
	console.log(key + " " + config[key]);
}
