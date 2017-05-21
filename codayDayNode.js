var fs = require('fs');
var http = require('http');

module.exports = {

	// URL HERE


	// BASE64 ENCODING IMAGES
	function base64_encode(file) {
	    var bitmap = fs.readFileSync(file);
	    return new Buffer(bitmap).toString('base64');
	}

	// BECAUSE I'M LAZY
	function print(input) {
		console.log(input)
	};

	// NOMAD API OOP OR WHATEVER
	function NomadAPI(arr) {
		this.url = 'http://54.208.17.147';
	};


	// DETECT IMAGE
	function nomadDetect(image, callback) {

		var imgb64 = base64_encode(image);

		var options = {
			host: url,
			port: 80,
			path: '/zappos/detect',
			json: true
		};

		var params = {
			'base64': imgb64
		};

		http.post(options, function(resp){
			resp.on('data', function(chunk){
				var json = chunk.toString('utf8');
				var data = JSON.parse(json);
				print(data);
				callback(data);
			});
		}).on("error", function(e){
			print(e.message);
			callback(new Error(e.message));
		});

	};


	// ------------------- REST ARE TO CALL THE FUNCTIONS THROUGH OOP
	NomadAPI.prototype.detect = function(image) {

		nomadDetect(image, function(err, response) {
			if (err) {
				return(err);
			} else {
				return(response);
			};
		});

	};

};

//EXAMPLE:
var nomad = NomadAPI()
var response = nomad.detect("imageDirectory.jpg") // RETURNS JSON
