// Init Parse with keys
	Parse.initialize("7wO9zjz5xMgigdjzUShTe9KFpGJfsRS9zUyeVD2I", "t7YR5eMgZGJSdsDy3InZeggIwGI0xOY6uCxB44zK");
	
	
// Make a list <ul> of <a> list of trips ok
// Give each link a data-attribute to asscoiate with a trip id. 
// Then set up links so they call on getEntry(tripId) and pass the id from data-attribute





// Print the list of Existing Trips into the Trip Page
function getTrip() {
	var Trip = Parse.Object.extend("Trip");
	var query = new Parse.Query(Trip);
	query.find({
		success: function(results) {
			for (var i in results) {
				$("#existing_trips").append("<li class='trip_li' id="+results[i].id+">"+results[i].get("name")+"</li>");
			}
			getEntry(results[i]);
		}, error: function(error){
			console.log("error trying to retrieve the existing trip list");
		}
	})
}

getTrip();


// Trip experiment Entries
function getEntry(tripId) {
	console.log("getting entries for trip id:", tripId);
	var Entry = Parse.Object.extend("Entry");
	var query = new Parse.Query(Entry);
	query.equalTo("trip", tripId);
	query.find({
		success: function(results) {
			for (var i in results) {
				console.log("getentry is work");
				var tripa = ".a"+results[i].get("trip").id;
				console.log(tripa);
				$(tripa).append("<li class='place'>"+results[i].get("place")+"</li>");	
			
			}
			console.log("***************");
		}, error: function(error){
			console.log("error trying to retrieve the existing entry list");
		}
	})
}
	

$(function(){
	
	//pre-determine how non-existant elements will work;
	$("#existing_trips").on("click", ".trip_li", function(name,id) {
		console.log("Trip li in existing trip clicked");
		$("#trip_area").css("display","none");
		$("#entry_area").css("display","visible");
		$("#entry_trip_name").text(name);
		//add a class to existing entry ul to populate with entries
		$("#existing_entries").addClass("a"+id);
	});
	
	
	//LOGIN AND SIGN UP
	//
    //LOGIN ACTIVATES
    $("#login").submit(function(event){
			var name = $("#login-name").val();
			var pass = $("#login-password").val();
			login(name, pass);
			showPages();
		});
	//SIGNUP ACTIVATES	
		$("#signup").submit(function(event) {
			console.log("Sign in submit");
			var name = $("#signup-name").val();
			var email = $("#signup-email").val();
			var password = $("#signup-password").val();
			signup(name, email, password);
			showPages();
		});
	function showPages(){
		event.preventDefault();
		$("#login_area").css("display","none");
		$("#trip_area").css("display","visible");
	}
	//SIGN UP FUNCTION
	 function signup(username, email, password) {
		console.log("Sign up new User", username, email, password);
		var user = new Parse.User();
		user.set("username", username);
		user.set("password", password);
		user.set("email", email);
		
		user.signUp(null, {
			success: function(user){
				console.log("Sign up Success:");
			},
			error: function(user, error) {
				console.log("Sign up error:"+error.message);
			}
		});
		
	}
	//LOGIN FUNCTION
	function login(username, password) {
		Parse.User.logIn(username, password, {
			success: function(user){
				console.log("Login Success:"+user.username); //is not getting the user.username
			},
			error: function(user, error) {
				console.log("login error:"+error.message);
			}
		});
	}
	//////////////////
	//CREATE TRIP
	/////
	$("#trip").submit(function(event){
			var trip_name = $("#trip-name").val();
			var trip_description = $("#trip-description").val();
			addTrip(trip_name, trip_description);
			showPages2();
			console.log("Got data for new trip", trip_name, trip_description);
		});
	////////////
	function addTrip(tripname, tripdesc) {
		console.log("echo");
		//here I need to create a new object for trip
		var Trip = Parse.Object.extend("Trip");
		var trip = new Trip();
		
		trip.set("name", tripname);
		trip.set("description", tripdesc);
		trip.set("author", Parse.User.current());
		
		trip.save(null, {
			success: function(trip){
				console.log("Created trip with success");
			},
			error: function(trip, error) {
				console.log("Adding Trip error:"+error.message);
			}
		});
	}
	////
	function showPages2(){
		event.preventDefault();
		$("#trip_area").css("display","none");
		$("#entry_area").css("display","visible");
	}
	//////////////////
	//CREATE ENTRY
	/////
	/*
	<div id="entry_area">
		<div id="entry_container">
			<h1>Create a new Entry</h1>
			<form id="entry">
			  <p>text<br><input id="entry-text" type="text"></p>
			  <p>image<br><input id="entry-image" type="text"></p>
			  <p>place<br><input id="entry-place" type="text"></p>
			  <p>tag<br><input id="entry-tag" type="text"></p>
			  <p><input type="submit"></p>
			</form>
		</div>
	</div>
	
	*/
	$("#entry").submit(function(event){
			var entry_text = $("#entry-text").val();
			var entry_image = $("#entry-image").val();
			var entry_place = $("#entry-place").val();
			var entry_tag = $("#entry-tag").val();
			addEntry(entry_text, entry_image, entry_place, entry_tag);
			showPages3();
			console.log("Got data for new entry", entry_text, entry_image, entry_place, entry_tag);
		});
	////////////
	function addEntry(entrytext, entryimg, entryplace, entrytag) {
		//here I need to create a new object for trip
		var Entry = Parse.Object.extend("Entry");
		var entry = new Entry();
		
		entry.set("text", entrytext);
		entry.set("image", entryimg);
		entry.set("place", entryplace);
		entry.set("tag", entrytag);
		entry.set("author", Parse.User.current());
		//entry.set("parent", trip);
		
		entry.save(null, {
			success: function(entry){
				console.log("Created entry with success");
			},
			error: function(entry, error) {
				console.log("Adding entry error:"+error.message);
			}
		});
	}
	////
	function showPages3(){
		event.preventDefault();
		$("#entry_area").css("display","none");
		$("#done_area").css("display","visible");
	}
	
});



/*testing adding photo with parse
function photoParse() {
		// Get the file to upload
		var fileUploadElement = $("#input-file")[0];
		var filepath = $("#input-file").val();
		var filename = filepath.split('\\').pop()
				
		// Upload the file 
		if (fileUploadElement.files.length > 0) {
			// If there's a file upload it then add a post
			var file = fileUploadElement.files[0];
			var parseFile = new Parse.File(filename, file);
			
			parseFile.save().then(function() {
				console.log("ParseFile Success");
				saveComment(parseFile);
			}, function(error) {
				console.log("ParseFile Error:"+error.message);
			});
		} else {
			// Else if no file just upload a post
			saveComment(false);
		}
}

function saveComment(file) {
		// Make a new Comment object - will generate a record in the Comment table
		var Comment = Parse.Object.extend("Comment");
		var comment = new Comment();
		// Set the current user as author of this comment
		comment.set("author", Parse.User.current());
		
		// check file 
		if (file) {
			comment.set("image", file);
		}
		
		// Save the new comment
		comment.save(null, {
			success: function(comment) {
				// If successful post a message 
				console.log("New Comment added:"+comment.id);
				updateComments(); // Update the comment list
			}, 	
			error: function(comment, error) {
				// Post a message if there's an error 
				console.log("Comment failed:"+error.message);
			}
		});
}


function updateComments() {
		// Get user 
		var user = Parse.User.current();
		
		// Make a new Comment Object - This represents the Comment table
		var Comment = Parse.Object.extend("Comment");
		
		// Query the comment table
		var query = new Parse.Query(Comment);
		query.include("author");
		
		// Order by date, most recent first
		query.descending("createdAt");
		
		// Run the Query find all
		query.find({
			success: function(results) {
				console.log("Comment Query success:"+results.length);
				var newList = "";
				// Loop through all of the results
				for (var i = 0; i < results.length; i++) {
					// get each object from results, get the comment field 
					var obj = results[i];
					var id = obj.id;
					var date = obj.get("createdAt");
					var author = obj.get("author");
					var username = author.get("username"); // attributes.username;
					var image = obj.get("image");
					var thumbnail = obj.get("thumbnail");
					
					var thumbImg = "";
					if (thumbnail != undefined) {
						thumbImg = "<p><a href='"+image.url()+"'><img src='"+thumbnail.url()+"'></a></p>";
					} else {
						thumbImg = "";
					}
					
					newList += "<li data-id='"+id+"'>"+
					comment+"<p>"+username+"</p>"+thumbImg+"</li>";
					
				}
				$("#scrap_area").html(newList);
			}
		});
	}
	
	// Load comments on load
	updateComments();
*/
