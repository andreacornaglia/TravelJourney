
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:

var Image = require("parse-image");

Parse.Cloud.beforeSave("Entry", function(request, response) {
	var comment = request.object;
	if (!comment.get("image")) {
		response.error("no image");
		return;
	}
	
	if (!comment.dirty("image")) {
		response.success();
		return;
	}
	
	Parse.Cloud.httpRequest({
		url: comment.get("image").url()
	}).then(function(response){
		var image = new Image();
		return image.setData(response.buffer);
	}).then(function(image){
		// crop 
		var size = Math.min(image.width(), image.height());
		return image.crop({
			left: (image.width() - size) / 2,
			top: (image.height() - size) / 2,
			width: size,
			height: size
		});
		
	}).then(function(image){
		return image.scale({
			width: 640,
			height: 640
		});
		
	}).then(function(image){
		return image.setFormat("JPEG");
		
	}).then(function(image){
		return image.data();
		
	}).then(function(buffer) {
		var base64 = buffer.toString("base64");
		var cropped = new Parse.File("thumbnail.jpg", {base64: base64});
		return cropped.save();
		
	}).then(function(cropped){
		comment.set("thumbnail", cropped);
		
	}).then(function(result){
		response.success();
		
	}, function(error){
		response.error(error);
	});
});

Parse.Cloud.beforeSave("Trip", function(request, response) {
	var comment = request.object;
	if (!comment.get("image")) {
		response.error("no image");
		return;
	}
	
	if (!comment.dirty("image")) {
		response.success();
		return;
	}
	
	Parse.Cloud.httpRequest({
		url: comment.get("image").url()
	}).then(function(response){
		var image = new Image();
		return image.setData(response.buffer);
	}).then(function(image){
		// crop 
		var size = Math.min(image.width(), image.height());
		return image.crop({
			left: (image.width() - size) / 2,
			top: (image.height() - size) / 2,
			width: size,
			height: size
		});
		
	}).then(function(image){
		return image.scale({
			width: 64,
			height: 64
		});
		
	}).then(function(image){
		return image.setFormat("JPEG");
		
	}).then(function(image){
		return image.data();
		
	}).then(function(buffer) {
		var base64 = buffer.toString("base64");
		var cropped = new Parse.File("thumbnail.jpg", {base64: base64});
		return cropped.save();
		
	}).then(function(cropped){
		comment.set("thumbnail", cropped);
		
	}).then(function(result){
		response.success();
		
	}, function(error){
		response.error(error);
	});
});