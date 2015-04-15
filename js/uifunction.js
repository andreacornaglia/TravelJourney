// Init Parse with keys
	Parse.initialize("7wO9zjz5xMgigdjzUShTe9KFpGJfsRS9zUyeVD2I", "t7YR5eMgZGJSdsDy3InZeggIwGI0xOY6uCxB44zK");

    ///////
	//SHOW EXISTING TRIPS
    ///////
function getTrip() {
	var Trip = Parse.Object.extend("Trip");
	var query = new Parse.Query(Trip);
    query.descending("createdAt");
	query.find({
		success: function(results) {
			for (var i in results) {
                console.log("the results[i] is: " + results[i]);
        var s = "<li class='trip_li timeline-element' id="+results[i].id+">";
        s+= "<div class='timeline-image'><img src='"+results[i].get("image")+"' alt='Picture'></div>";
        s+= "<div class='timeline-content'>";
        s+="<h2 class='entry-title'>"+results[i].get("name")+"</h2></div></li>";
                
				$("#existing_trips").append(s);
			}
			//I'm calling getEntry here and works, but shouldn't be here! getEntry(results[i]);
		}, error: function(error){
			console.log("error trying to retrieve the existing trip list");
		}
	})
}

getTrip();

    ///////
	//X//SHOW ENTRIES ONCE CLICKED ON TRIP
    ///////
function getEntry(tripId) { 
	console.log("getting entries for trip id:" + tripId);
	var Entry = Parse.Object.extend("Entry");
	var query = new Parse.Query(Entry);
    query.descending("createdAt");
    var Trip = Parse.Object.extend("Trip");
	var trip = new Trip({id:tripId});
    
	query.equalTo("trip", trip);
    
	query.find({
		success: function(results) {
			for (var i in results) {
                console.log(results[i].get("place"));
                var s = "<li class='entry_li timeline-element' id="+results[i].id+">";
        s+= "<div class='timeline-image'><img src="+results[i].get("image").url()+" alt='Picture'></div>";
        s+= "<div class='timeline-content'>";
        s+="<h2 class='entry-title'>"+results[i].get("place")+"</h2></div></li>";
                
				$("#existing_entries").append(s);	
			}
			console.log("***************");
		}, error: function(error){
			console.log("error trying to retrieve the existing entry list");
		}
	})
}	

    ///////
	//SHOW DETAILS ONCE CLICKED ON ENTRY
    ///////

function getDetails(entryId) { // tripId: String
    console.log("Searching for entry:"+entryId);
    
    var Entry = Parse.Object.extend("Entry");
	var query = new Parse.Query(Entry);
    
    // object to save in field var trip = new Trip({id:"idfortrip"})
    // object parent var entry = new Entry()
    // entry.set("trip", trip)
    // NOT THIS entry.set("trip", "tripid")
  
    query.equalTo("objectId", entryId);
    query.include("trip");
    // query.include(["trip.author"]);
    
    query.find({
		success: function(results) {
            console.log("get details results:"+results);
            console.log("trip:"+results[0].get("trip").get("name"));
			for (var i in results) {
                console.log("retrieving details for entry id" + results[i].id);
				$("#entry_things").append("<li class='things'>"+results[i].get("place")+"</li>");
                $("#entry_things").append("<li class='things'>"+results[i].get("image")+"</li>");
                $("#entry_things").append("<li class='things'>"+results[i].get("text")+"</li>");
                $("#entry_things").append("<li class='things'>"+results[i].get("tag")+"</li>");
			
			}
			console.log("***************");
		}, error: function(error){
			console.log("error trying to retrieve the details of current entry");
		}
	})
}	



var currentTrip = "no trip selected";

$(function(){
	
    getLocation();
	///////
	//CLICK ON EXISTING TRIP
    ///////
	$("#existing_trips").on("click", ".trip_li", function() {
		console.log("Trip li in existing trip clicked");
		$("#trip_area").css("display","none");
		$("#entry_area").css("display","visible");
        var name = $(this).text();
        console.log("name is" + name);
		$("#entry_trip_name").text(name);
        //is this correct??
        var id = $(this).attr('id');
        $("#entry_trip_name").addClass(id);
        console.log("id is" + id);
		$("#existing_entries").addClass("a"+id);
        //here I need to call the fuction to populate the trip with the entries, but not working
        
        currentTrip = id;
        getEntry(id);
	});
    
    ///////
	//CLICK ON EXISTING ENTRY
    ///////
    $("#existing_entries").on("click", ".entry_li", function() {
		console.log("Trip li in existing trip clicked");
		$("#entry_area").css("display","none");
		$("#details_area").css("display","visible");
        var name = $(this).text();
        console.log("name is" + name);
		$("#entry_entry_name").text(name);
        var id = $(this).attr('id');
        console.log("entry id is" + id);
        getDetails(id);
	});
	
	
	//LOGIN AND SIGN UP
	/////////////
    //LOGIN ACTIVATES
    $("#login").submit(function(event){
			var name = $("#login-name").val();
			var pass = $("#login-password").val();
			login(name, pass);
			showPages();
		});
    ////////
	//SIGNUP ACTIVATES	
    ///////
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
    ////////
	//SIGN UP FUNCTION
    ///////
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
    ///////
	//LOGIN FUNCTION
    ///////
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
        console.log("Trip is being added", trip_name, trip_description);
        var trip_name = $("#trip-name").val();
        var trip_description = $("#trip-description").val();
        addTrip(trip_name, trip_description);
        showPages2(trip_name);
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
	function showPages2(trip_name){
		event.preventDefault();
		$("#trip_area").css("display","none");
		$("#entry_area").css("display","visible");
        $("#entry_trip_name").text(trip_name);
	}
	//////////////////
	//CREATE ENTRY
	/////
	
	$("#entry").submit(function(event){
       event.preventDefault();
       console.log("Entry is being submitted");
        
       var fileUploadElement = $("#entry-image")[0];
	   var filepath = $("#entry-image").val();
	   var filename = filepath.split('\\').pop();
        
       if (fileUploadElement.files.length > 0) {
			// If there's a file upload it then add a post
			var file = fileUploadElement.files[0];
			var parseFile = new Parse.File(filename, file);
			
			parseFile.save().then(function() {
				console.log("ParseFile Success");
				addEntry(parseFile);
			}, function(error) {
				console.log("ParseFile Error:"+error.message);
			});
		} else {
			// Else if no file just upload a post
			addEntry(false);
		}
      console.log("Entry is ok, proceed to addEntry");
    });
        
	////////////
        
	function addEntry(file) {
        console.log("addEntry is activated");
		var Entry = Parse.Object.extend("Entry");
		var entry = new Entry();
        
        var entry_text = $("#entry-text").val();
        var entry_place = $("#entry-place").val();
        var entry_tag = $("#entry-tag").val();
        var entry_geoloc = $("#entry-geo").val();
        var entry_trip = $("#entry_trip_name").attr("class");
        console.log(entry_trip);
		
		entry.set("text", entry_text);
		entry.set("place", entry_place);
		entry.set("tag", entry_tag);
		entry.set("author", Parse.User.current());
        entry.set("geolocation", entry_geoloc);
        entry.set("mytrip", entry_trip);
        
		if (file) {
		  entry.set("image", file);
        }
		
		entry.save(null, {
			success: function(entry){
				console.log("Created entry with success");
			},
			error: function(entry, error) { //giving error here: invalid type for key image, expected string, but got file
				console.log("Adding entry error:"+error.message);
			}
		});
	   console.log("addEntry works!");
    }
	////
	function showPages3(){
		event.preventDefault();
		$("#entry_area").css("display","none");
		$("#done_area").css("display","visible");
	}
	
    // Initialize page stuff
    
    if (Parse.User.current()) {
        // user logged in 
        // show add entry screen
        $("#login_area").hide();
    } else {
        // show log in screen
    }
    
    ////////
    //ANIMATE THE COMPOSE BUTTON
    //////////
    var step=Math.PI/4;
    var offset= -3 * Math.PI/8;
    
    $(".btn_selectbig").hover(function(){
        $(".btn_select").each(function(i){
            var x=(Math.sin(step*i+offset)*90)+70;
            var y=(Math.cos(step*i+offset)*90)+30;
            $(this).animate({left:x+"px",bottom:y+"px"},200);
    	});
    });
    
    $(".btn_select").click(function(){
        $(".btn_select").animate({left:"70px",bottom:"30px"},200);
    });
    
    $(".btn_selectbig").click(function(){
        $(".btn_select").animate({left:"70px",bottom:"30px"},200);
    });
    
});

//function to open/close the dropdown area of new trip/entry

$(".trip_lialt span").on('click', function(){
    $("#newtrip").toggle();
})

$(".entry_lialt span").on('click', function(){
    $("#entry_area").css("display","none");
    $("#compose_area").css("display","visible");
})

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
    console.log("I'm getting the location");
}

function showPosition(position) {
    var latlon = position.coords.latitude + "," + position.coords.longitude;
    $("#entry-geo").val(latlon);
    console.log("current location:"+ latlon);
}

function addMap(position){
    var latlon = position.coords.latitude + "," + position.coords.longitude;
    var img_url = "http://maps.googleapis.com/maps/api/staticmap?center="
    +latlon+"&zoom=14&size=400x300&sensor=false";
    $("#scrap_area").append("<div id='mapholder'></div>");
    document.getElementById("mapholder").innerHTML = "<img src='"+img_url+"'>";
    console.log("I'm getting the map");
}

$("#entry_back").on("click", function(){
    $("#trip_area").css("display","block");
    $("#details_area").css("display","none");
    $("#entry_area").css("display","none");
});

$("#details_back").on("click", function(){
    $("#details_area").css("display","none");
    $("#entry_area").css("display","block");
});

$(".entry-title").on("click", function(){
    $("#newentry").toggle("display");
})