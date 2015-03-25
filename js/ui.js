// Init Parse with keys
	Parse.initialize("7wO9zjz5xMgigdjzUShTe9KFpGJfsRS9zUyeVD2I", "t7YR5eMgZGJSdsDy3InZeggIwGI0xOY6uCxB44zK");

$(function(){
	//This Part Animates the main navigation button
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
    
    //This Part Creates the variables for login and sign up with parse
    $("#login").submit(function(event){
			var name = $("#login-name").val();
			var pass = $("#login-password").val();
			login(name, pass);
			event.preventDefault();
			$("#login_area").css("display","none");
		});
		
		$("#signup").submit(function(event) {
			console.log("Sign in submit");
			var name = $("#signup-name").val();
			var email = $("#signup-email").val();
			var password = $("#signup-password").val();
			signup(name, email, password);
			event.preventDefault();
			$("#login_area").css("display","none");
		});
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
	
	function login(username, password) {
		Parse.User.logIn(username, password, {
			success: function(user){
				console.log("Login Success:"+user.username);
			},
			error: function(user, error) {
				console.log("login error:"+error.message);
			}
		});
		
	}
});

//This part adds text when clicking on add text button
function addText(){
    console.log("addText triggered");
    $("#scrap_area").append("<div class='textArea'> hello world!</div>");
}


/*Code working without the back-end*/

function addPhoto(){
    console.log("addPhoto triggered");
    $("#scrap_area").append("<div id='image'><p id='photo_confirm'>click here to confirm<p></div>");
    var fileInput = document.getElementById('inputFile');
    var image = document.getElementById('image');

    document.getElementById('image').addEventListener('click', function(){
		$("#photo_confirm").css("display", "none");
        var fileUrl = window.URL.createObjectURL(fileInput.files[0]);

        $('#image').css('background-image','url('+ fileUrl +')');
		$('#image').draggable();
    });

};


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
    var img_url = "http://maps.googleapis.com/maps/api/staticmap?center="
    +latlon+"&zoom=14&size=400x300&sensor=false";
    $("#scrap_area").append("<div id='mapholder'></div>");
    document.getElementById("mapholder").innerHTML = "<img src='"+img_url+"'>";
    console.log("I'm getting the map");
    
    /*Still not implemented, should show the user nearby locations*/
    var places_nearby ="https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+ latlon +"&radius=500&key=AIzaSyAh3q_MPWSrZSinItkczPA7zU7OTuTQHss";
    
    /*Find Places*/
    
    function initialize() {
    var pyrmont = new google.maps.LatLng(position.coords.latitude,  position.coords.longitude);

    var request = {
        location: pyrmont,
        radius: 500,
        types: ['store']
      };
      infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);
    }

    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          $("#scrap_area").append("<li>"+result[i]+"</li>");
        }
      }
    }

    function createMarker(place) {
      var placeLoc = place.geometry.location;
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
      });
    }
    
    google.maps.event.addDomListener(window, 'load', initialize);
}




