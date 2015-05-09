// Init Parse with keys
Parse.initialize("7wO9zjz5xMgigdjzUShTe9KFpGJfsRS9zUyeVD2I", "t7YR5eMgZGJSdsDy3InZeggIwGI0xOY6uCxB44zK");
    
//Defining Parse Variables
var Trip = Parse.Object.extend("Trip");
var Entry = Parse.Object.extend("Entry");
    
//Defining Global Variables
var listTrips = [];
var listEntries = [];
var currentTrip = "no trip selected";
var currentEntry = "no entry selected";
var currentUser = "no user selected";

/////////SHOW EXISTING TRIPS
function getTrip() {
	var query = new Parse.Query(Trip);
    query.descending("createdAt");
    
	query.find({
		success: function(results) {
			for (var i in results) {
                console.log("the results[i] is: " + results[i]);
        /*Uncaught TypeError: Cannot read property 'url' of undefined       
        var src = results[i].get("image").url();
                if ( src === undefined) {
                    src = "../images/balloon.jpg";
                }
        */         
        var s = "<div class='swiper-slide trip_li' id="+results[i].id+">";
        s+= "<div class='timeline-image'><img src='images/balloon.jpg' alt='Picture'></div>";
        s+= "<div class='timeline-content'>";
        s+="<h2 class='entry-title'>"+results[i].get("name")+"</h2></div></div></div>";
                
				$("#existing_trips").append(s);
                activateSwiper();
			}
			//I'm calling getEntry here and works, but shouldn't be here! getEntry(results[i]);
		}, error: function(error){
			console.log("error trying to retrieve the existing trip list");
		}
	})
}

getTrip();


function getEntry(tripId) {
    console.log("getting entries for trip id:" + tripId);
	var query = new Parse.Query(Entry);
    query.include('user');
    
    query.descending("createdAt");
	query.equalTo("mytrip", tripId);
    
	query.find({
		success: function(results) {
            console.log("Get Entry:"+results.length);
            currentEntries = results;
			for (var i in results) {
                
                console.log("Get Entry Place:"+results[i].get("place"));
                var parseDate = results[i].createdAt;
                console.log(parseDate);
                var date = moment(parseDate).calendar();
                
                var src = results[i].get("image").url();
                if ( src === undefined) {
                    src = "../images/balloon.jpg";
                }
                    
                var s = "<div class='entry_li tile_padding e"+results[i].get("author").id+"' id="+results[i].id+"><div class='tile' style='background-image:url(" + src + ")'></div></div>";
                
                
            /*s+= "<div class='timeline-content'>";
            s+= "<p class='date'>"+date+", "+results[i].get("place")+"</p></div>";
            s+= "<div class='timeline-image'><img src="+src+" alt='Picture'></div></li>";*/
               /* $('.tile').css('background-image','url(' + src + ')');*/

                $("#existing_entries").append(s);
			}
			console.log("***************");
		}, error: function(error){
			console.log("error trying to retrieve the existing entry list:"+error.message);
		}
	})
}

/////////SHOW DETAILS ONCE CLICKED ON ENTRY

function getDetails(entryId) { // tripId: String
    console.log("Searching for entry:"+entryId);
	var query = new Parse.Query(Entry);
  
    query.equalTo("objectId", entryId);
    query.include("trip");
    
    query.find({
		success: function(results) {
            console.log("get details results:"+results);
			for (var i in results) {
                var parseDate = results[i].get("createdAt");
                var date = moment(parseDate).calendar();
                var img_url = "http://maps.googleapis.com/maps/api/staticmap?center="
    +results[i].get("geolocation")+"&zoom=14&size=400x300&sensor=false";
                
                console.log("retrieving details for entry id" + results[i].id);
                $("#entry_things").append("<img class='details_photo' src="+results[i].get("image").url()+">");
                $("#entry_things").append("<input class='things' readonly value='"+results[i].get("text")+"'/>");
                
                $("#entry_things").append("<div id='mapholder'><img src='"+img_url+"'></div>");
                $("#entry_things").append("<li class='things'>"+date+"</li>");
			
			}
			console.log("***************");
		}, error: function(error){
			console.log("error trying to retrieve the details of current entry");
		}
	})
}	


$(function(){
	
    getLocation();
    
/////////CLICK ON EXISTING TRIP
	$("#existing_trips").on("click", ".trip_li", function() {
		console.log("Trip li in existing trip clicked");
		$("#trip_area").css("display","none");
		$("#entry_area").css("display","block");
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
    
    
/////////CLICK ON EXISTING ENTRY
    $("#existing_entries_andrea").on("click", ".entry_li", function() {
		console.log("Trip li in existing trip clicked");
		$("#entry_area").css("display","none");
		$("#details_area").css("display","block");
        var name = $(this).text();
        console.log("name is" + name);
		$("#entry_entry_name").text(name);
        var id = $(this).attr('id');
        console.log("entry id is" + id);
        getDetails(id);
	});
    $("#existing_entries_bruno").on("click", ".entry_li", function() {
		console.log("Trip li in existing trip clicked");
		$("#entry_area").css("display","none");
		$("#details_area").css("display","block");
        var name = $(this).text();
        console.log("name is" + name);
		$("#entry_entry_name").text(name);
        var id = $(this).attr('id');
        console.log("entry id is" + id);
        getDetails(id);
	});
	
	
///////////LOGIN AND SIGN UP
///////////////LOGIN ACTIVATES
    $("#login").submit(function(event){
			var name = $("#login-name").val();
			var pass = $("#login-password").val();
			login(name, pass);
			showPages();
		});
    
//////////SIGNUP ACTIVATES	
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
		$("#trip_area").css("display","block");
	}
    
//////////SIGN UP FUNCTION
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

/////////LOGIN FUNCTION
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

///////////////CREATE TRIP
	$("#trip").submit(function(event){
        event.preventDefault();
        console.log("Trip is being added");
        
       var fileUploadElement = $("#trip-image")[0];
	   var filepath = $("#trip-image").val();
	   var filename = filepath.split('\\').pop();
        
       if (fileUploadElement.files.length > 0) {
			// If there's a file upload it then add a post
			var file = fileUploadElement.files[0];
			var parseFile = new Parse.File(filename, file);
			
			parseFile.save().then(function() {
				console.log("ParseFile Success");
				addTrip(parseFile);
			}, function(error) {
				console.log("ParseFile Error:"+error.message);
			});
		} else {
			// Else if no file just upload a post
			addTrip(false);
		}
      console.log("Entry is ok, proceed to addEntry");
        
        addTrip(trip_name, trip_description);
        //showPages2(trip_name);
        console.log("Got data for new trip", trip_name, trip_description);
    });

////////////ADD TRIP
	function addTrip(file) {
		console.log("echo");
		//here I need to create a new object for trip
		var Trip = Parse.Object.extend("Trip");
		var trip = new Trip();
        
        var trip_name = $("#trip-name").val();
        var trip_description = $("#trip-description").val();
        var trip_date_start = $("#trip-date-start").val();
        var trip_date_end = $("#trip-date-end").val();
		
		trip.set("name", trip_name);
		trip.set("description", trip_description);
		trip.set("author", Parse.User.current());
        trip.set("dateStart", trip_date_start);
        trip.set("dateEnd", trip_date_end);
        
        if (file) {
		  entry.set("image", file);
        }
		
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
		$("#entry_area").css("display","block");
        $("#entry_trip_name").text(trip_name);
	}
    
/////////////CREATE ENTRY
	$("#entry").submit(function(event){
       event.preventDefault();
       console.log("Entry is being submitted");
       var trip_name = $("#h1").text();
        
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
        
////////////ADD ENTRY 
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
       showPages2(trip_name);
    }
	////
	function showPages3(){
		event.preventDefault();
		$("#entry_area").css("display","none");
		$("#done_area").css("display","block");
	}
	
    // Initialize page stuff
    
    if (Parse.User.current()) {
        // user logged in 
        // show add entry screen
        $("#login_area").hide();
    } else {
        // show log in screen
    }
    

//////////ANIMATE THE COMPOSE BUTTON
    var step=Math.PI/5;
    var offset= -Math.PI/2;
    
    $("#trip_area .btn_selectbig").click(function(){
        $(this).css('display','none');
        $(".overlay").animate({top:"0px"},500);
        $(".overlay").css('display','block');
    });
    
    $("#trip_area .btn_select").click(function(){
        $(".overlay").css('display','none');
    });
    
    $("#entry_area .btn_selectbig i").click(function(){
        $(".btn_select").each(function(i){
            var x=(Math.sin(step*i+offset)*130)+100;
            var y=(Math.cos(step*i+offset)*130)+30;
            $(this).animate({left:x+"px",bottom:y+"px", opacity:1},200);
    	});
        $("#entry_area .btn_selectbig").toggleClass("btn_selectbig_selected btn_selectbig_extra");
        $(".overlay").toggle('display');
    });
    
    $("#entry_area .btn_select").click(function(){
        $("#newentry").css('display','block');
        $(".btn_select").animate({left:"100px",bottom:"30px", opacity:0},200);
        $("#entry_area .btn_selectbig").removeClass("btn_selectbig_selected btn_selectbig_extra");
    });
    
    
    
    
});

//////////GET LOCATION
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

//////////SCREEN TRANSITIONS
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

$(".addtrip-title").on("click", function(){
    $("#newtrip").toggle("display");
})

$("#h2_add_new_trip").on("click", function(){
    $("#trip_area").css("display","none");
    $("#addoredit_trip_area").css("display","block");
    $("#edit_trip_name").text("New Trip");
})

////LOGOUT
$("#logout").on("click", function(){
    Parse.User.logOut();
})

///slider code
function activateSwiper() {
    //initialize swiper when document ready  
    var mySwiper = new Swiper ('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: true
    })        
};

//expands tile entry when clicked, becoming full screen
$("body").on("click", ".tile",function() {
    console.log("tile clicked");
    $(this).toggleClass("slow",'tile_clicked');
    $(".tile_bar").toggle("display");
});

//hides add button when user is scrolling
$(document).scroll(function(){  
    $('.box').fadeOut();

    var scrollA = $('body').scrollTop();

    setTimeout(function(){
        if(scrollA == $('body').scrollTop()){
            $('.box').fadeIn();
        }
    }, 400);
})

//animate forms

$( ".input" ).focusin(function() {
  $( this ).find( "span" ).animate({"opacity":"0"}, 200);
});

$( ".input" ).focusout(function() {
  $( this ).find( "span" ).animate({"opacity":"1"}, 300);
});

$("#trip").submit(function(){
  $("input").css({"border-color":"#2ecc71"});
  return false;
});

function addPhoto(){
    $("#newentry").css('display','block');
}
function addText(){
    $("#newentry").css('display','block');
}
function addLocation(){
    $("#newentry").css('display','block');
}
function addTags(){
    $("#newentry").css('display','block');
}