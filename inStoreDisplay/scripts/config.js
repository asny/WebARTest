var config = {};
// performance stuff
config['updateInterval'] = 500; // miliseconds

// visual stuff
config['changePageDuration'] = 500; // miliseconds
config['productInfoBackgroundBlur'] = 4; // miliseconds

console.log('registered config');

for(var key in config) {
	console.log(key + ' ' + config[key]);
}
