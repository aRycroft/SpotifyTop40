let url = new URL(window.location.href); 
let access_token = url.searchParams.get("access_token");
let topArtists = [];
class topArtist{
	constructor(name, imgURL, id){
		this.name = name;
		this.imgURL = imgURL;
		this.id = id;
	}
}

function addArtists(){
	for (let i = 0; i < topArtists.length; i++){
		let imgcontainer = document.createElement('div');
		imgcontainer.setAttribute("class", "imgcontainer");
		imgcontainer.setAttribute("onclick", "image(this)");
		imgcontainer.setAttribute("id", i);

		let backside = document.createElement('div');
		backside.setAttribute("class", "artistimg-back");

		let heading = document.createElement('p');
		heading.setAttribute("class", "headingName");

		let toptrack= document.createElement('p');
		toptrack.setAttribute("class", "toptrack");
		backside.appendChild(heading);
		backside.appendChild(toptrack);
		imgcontainer.appendChild(backside);

		let img = document.createElement('img');
		img.setAttribute("class", "artistimg");
		img.setAttribute("src", topArtists[i].imgURL.url);
		imgcontainer.appendChild(img);

		document.getElementById('artistpics').appendChild(imgcontainer);
	}
}

function getTopTracks(id, i){
	getInfo("https://api.spotify.com/v1/artists/" + id +"/top-tracks?country=from_token").then(function(result){
		let artistinfo = JSON.parse(result);
		console.log(artistinfo);
		let backInfoP = document.getElementById(i).getElementsByTagName('div')[0];
		backInfoP.getElementsByClassName('headingName')[0].innerHTML = artistinfo.tracks[0].artists[0].name;
		for(let i = 0; i < 10; i++){ 
			backInfoP.getElementsByClassName('toptrack')[0].innerHTML += artistinfo.tracks[i].name + "<br>";
		}
		/*
		let overlay = document.getElementById("artistoverlay");
		document.getElementById("artistoverlay").style.display = "block";
		document.getElementById("artistoverlay").style.zIndex = "1";
		document.getElementById("artistoverlay").style.animation = "play 1s linear fade-in";
		overlay.style.opacity = "0.7";
		overlay.style.zIndex = "1";
		document.getElementById("artistname").innerHTML = topArtists[i].name;
		document.getElementById("toptracks").innerHTML = artistinfo.tracks[0].name;*/
	});
}

function image(imagecontainer){
	let i = imagecontainer.getAttribute("id");
	let id = topArtists[i].id;
	let backInfoP = document.getElementById(i).getElementsByTagName('div')[0].getElementsByClassName('headingName')[0].innerHTML;
	if(backInfoP == ""){
		getTopTracks(id, i);
	}
	let image = document.getElementById(i).style.transform;
	if(document.getElementById(i).style.transform == "rotateY(180deg)"){
		document.getElementById(i).style.transform = "";
	}
	else{
		document.getElementById(i).style.transform = "rotateY(180deg)";
	}
	
}
function overlay(){
	let overlay = document.getElementById("artistoverlay");
	overlay.style.opacity = "0";
	setTimeout(function(){overlay.style.zIndex = "-1"}, 1000);
	//document.getElementById("artistoverlay").style.animation = "play 1s linear fade-in";
}
function getInfo(URL){
	var promise = new Promise(function(resolve, reject){
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "GET", URL, true ); // false for synchronous request
		xmlHttp.setRequestHeader("Accept", "application/json");
   	xmlHttp.setRequestHeader("Content-Type", "application/json");
   	xmlHttp.setRequestHeader("Authorization", "Bearer " + access_token);
   	xmlHttp.onload = () => {
   		if(xmlHttp.readyState === 4){
   			if(xmlHttp.status === 200){
   				resolve(xmlHttp.response);
   			}
   		} 	
  		};
   	xmlHttp.send(null);
	});
   return promise;
}
/*
getInfo("https://api.spotify.com/v1/me").then(function(result){
	let userinfo = JSON.parse(result);
	document.getElementById("username").innerHTML = userinfo.display_name;
});
*/
getInfo("https://api.spotify.com/v1/me/top/artists?limit=40&time_range=long_term").then(function(result){
	let fav = JSON.parse(result);
	for(let i = 0; i < fav.items.length; i++){
		topArtists.push(new topArtist(fav.items[i].name, fav.items[i].images[0], fav.items[i].id));
	}
	addArtists();
});



