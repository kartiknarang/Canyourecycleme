var fs = require('fs');
var http = require('http');

module.exports = {

	// URL HERE
	var url = 'http://54.208.17.147';

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
	function nomadAPI(arr) {
		this.client_id = arr['client_id'];
		this.client_secret = arr['client_secret'];
		this.client_token = arr['access_token'];
		this.auth_Token = "";
		this.error = 0
	};

	// GETTING AUTHORIZATION TOKEN
	function nomadGetAuthToken(object, callback) {

		var auth = new Buffer(object.client_id + ":" + object.client_secret).toString('base64');

		var options = {
			host: url,
			port: 80,
			path: '/api/oauth/token',
			headers: {
				'Authorization': 'Basic ' +  auth
			},
			json: true
		};

		var params = {
			'grant_type': object.client_token
		};

		http.post(options, function(resp){
			resp.on('data', function(chunk){
				var json = chunk.toString('utf8');
				var data = JSON.parse(json);
				print(data.token);
				object.auth_Token = data.token;
				callback(data.token);
			});
		}).on("error", function(e){
			print(e.message);
			callback(new Error(e.message));
		});
	};


	// CHECKING IF TOKEN IS EXPIRED
	function checkToken(authToken, callback) {

		var options = {
			host: url,
			port: 80,
			path: '/api/projects/restricted',
			headers: {
				'Authorization': 'Bearer ' + authToken
			},
			json: true
		};

		http.get(options, function(resp){
			resp.on('data', function(chunk){
				var json = chunk.toString('utf8');
				var data = JSON.parse(json);
				print(data);
				callback(data.success);
			});
		}).on("error", function(e){
			print(e.message);
			callback(new Error(e.message));
		});

	};

	// DETECT IMAGE
	function nomadDetect(authToken, image, project_id, callback) {

		var imgb64 = base64_encode(image);

		var options = {
			host: url,
			port: 80,
			path: '/api/projects/' + project_id + '/detect',
			headers: {
				'Authorization': 'Bearer ' + authToken
			},
			json: true
		};

		var params = {
			'image': imgb64
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

	// ADD A MODEL
	function nomadAddModel(authToken, image, project_id, callback) {

		var imgb64 = base64_encode(image);

		var options = {
			host: url,
			port: 80,
			path: '/api/projects/' + project_id + '/models/add',
			headers: {
				'Authorization': 'Bearer ' + authToken
			},
			json: true
		};

		var params = {
			'image': imgb64
		};

		http.post(options, function(resp){
			resp.on('data', function(chunk){
				var json = chunk.toString('utf8');
				var data = JSON.parse(json);
				print(data);
				return data;
			});
		}).on("error", function(e){
			print(e.message);
			callback(new Error(e.message));
		});

	};

	// REMOVE A MODEL
	function nomadRemoveModel(authToken, image_id, project_id, callback) {

		var options = {
			host: url,
			port: 80,
			path: '/api/projects/' + project_id + '/models/remove',
			headers: {
				'Authorization': 'Bearer ' + authToken
			},
			json: true
		};

		var params = {
			"_id": image_id
		};

		http.post(options, function(resp){
			resp.on('data', function(chunk){
				var json = chunk.toString('utf8');
				var data = JSON.parse(json);
				print(data);
				return data;
			});
		}).on("error", function(e){
			print(e.message);
			callback(new Error(e.message));
		});

	};

	// CHECK SUCCESS OF TRAIN
	function nomadTrain(authToken, callback) {

		var options = {
			host: url,
			port: 80,
			path: '/api/projects/' + project_id + '/train',
			headers: {
				'Authorization': 'Bearer ' + authToken
			},
			json: true
		};

		http.post(options, function(resp){
			resp.on('data', function(chunk){
				var json = chunk.toString('utf8');
				var data = JSON.parse(json);
				print(data);
				return data.token;
			});
		}).on("error", function(e){
			print(e.message);
			callback(new Error(e.message));
		});

	};

	// GET PROJECT I DONT KNOW WHAT THIS REALLY DOES
	function nomadGetProject(authToken, project_id, callback) {

		var options = {
			host: url,
			port: 80,
			path: '/api/projects/' + project_id,
			headers: {
				'Authorization': 'Bearer ' + authToken
			},
			json: true
		};

		http.get(options, function(resp){
			resp.on('data', function(chunk){
				var json = chunk.toString('utf8');
				var data = JSON.parse(json);
				print(data.token);
				return data.token;
			});
		}).on("error", function(e){
			print(e.message);
			callback(new Error(e.message));
		});

	};

	//GET ALL PROJECTS
	function nomadGetAllProjects(authToken, callback) {

		var options = {
			host: url,
			port: 80,
			path: '/api/projects/',
			headers: {
				'Authorization': 'Bearer ' + authToken
			},
			json: true
		};

		http.get(options, function(resp){
			resp.on('data', function(chunk){
				var json = chunk.toString('utf8');
				var data = JSON.parse(json);
				print(data.token);
				return data.token;
			});
		}).on("error", function(e){
			print(e.message);
			callback(new Error(e.message));
		});

	};


	// ------------------- REST ARE TO CALL THE FUNCTIONS THROUGH OOP OR WHATEVER
	nomadAPI.prototype.detect = function(arr) {
		checkToken(this.auth_Token, function(err, data){
			if (err) {
				nomadGetAuthToken(this, function(err, token) {
					if (err) {
						return(err + "unable to get token");
					} else {
						nomadDetect(this.auth_Token, arr['image'], arr['project_id'], function(err, response) {
							if (err) {
								return(err);
							} else {
								return(response);
							};
						});
					}
				});
			} else {
				nomadDetect(this.auth_Token, arr['image'], arr['project_id'], function(err, response) {
					if (err) {
						return(err);
					} else {
						return(response);
					};
				});
			};
		});
	};

	nomadAPI.prototype.addModel = function(arr) {
		checkToken(this.auth_Token, function(err, data){
			if (err) {
				nomadGetAuthToken(this, function(err, token) {
					if (err) {
						return(err + "unable to get token");
					} else {
						nomadAddModel(this.auth_Token, arr['image'], arr['project_id'], function(err, response) {
							if (err) {
								return(err);
							} else {
								return(response);
							};
						});
					}
				});
			} else {
				nomadAddModel(this.auth_Token, arr['image'], arr['project_id'], function(err, response) {
					if (err) {
						return(err);
					} else {
						return(response);
					};
				});
			};
		});
	};

	nomadAPI.prototype.removeModel = function(arr) {
		checkToken(this.auth_Token, function(err, data){
			if (err) {
				nomadGetAuthToken(this, function(err, token) {
					if (err) {
						return(err + "unable to get token");
					} else {
						nomadRemoveModel(this.auth_Token, arr['image'_id], arr['project_id'], function(err, response) {
							if (err) {
								return(err);
							} else {
								return(response);
							};
						});
					}
				});
			} else {
				nomadRemoveModel(this.auth_Token, arr['image_id'], arr['project_id'], function(err, response) {
					if (err) {
						return(err);
					} else {
						return(response);
					};
				});
			};
		});
	};

	nomadAPI.prototype.train = function(arr) {
		checkToken(this.auth_Token, function(err, data){
			if (err) {
				nomadGetAuthToken(this, function(err, token) {
					if (err) {
						return(err + "unable to get token");
					} else {
						nomadTrain(this.auth_Token, function(err, response) {
							if (err) {
								return(err);
							} else {
								return(response);
							};
						});
					}
				});
			} else {
				nomadTrain(this.auth_Token, function(err, response) {
					if (err) {
						return(err);
					} else {
						return(response);
					};
				});
			};
		});
	};

	nomadAPI.prototype.getProject = function(arr) {
		checkToken(this.auth_Token, function(err, data){
			if (err) {
				nomadGetAuthToken(this, function(err, token) {
					if (err) {
						return(err + "unable to get token");
					} else {
						nomadGetProject(this.auth_Token, arr['project_id'], function(err, response) {
							if (err) {
								return(err);
							} else {
								return(response);
							};
						});
					}
				});
			} else {
				nomadGetProject(this.auth_Token, arr['project_id'], function(err, response) {
					if (err) {
						return(err);
					} else {
						return(response);
					};
				});
			};
		});
	};

	nomadAPI.prototype.getAllProjects = function(arr) {
		checkToken(this.auth_Token, function(err, data){
			if (err) {
				nomadGetAuthToken(this, function(err, token) {
					if (err) {
						return(err + "unable to get token");
					} else {
						nomadGetAllProjects(this.auth_Token, function(err, response) {
							if (err) {
								return(err);
							} else {
								return(response);
							};
						});
					}
				});
			} else {
				nomadGetAllProjects(this.auth_Token, function(err, response) {
					if (err) {
						return(err);
					} else {
						return(response);
					};
				});
			};
		});
	};

};
