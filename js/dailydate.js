//stored data
var selected = 'tohka';
var selectedLocation = '';
var selectedRoute = '';
var data = JSON.parse(httpGet('spirits.json'));

function loadData() {
	if(localStorage['dalDDSelected']) {
		selected = localStorage['dalDDSelected'];
	}
	if(localStorage['dalDDSelectedLocation']) {
		selectedLocation = localStorage['dalDDSelectedLocation'];
	}
	if(localStorage['dalDDSelectedRoute']) {
		selectedRoute = localStorage['dalDDSelectedRoute'];
	}
}


function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function init() {
	let parent = document.getElementsByClassName('left')[0];
	for(var i in data.spirit) {
		var div = document.createElement('div');
		var img = document.createElement('img');
		div.classList.add('spirit');
		img.classList.add('thumb');
		img.setAttribute('src',data.spirit[i].data.img)
		div.id = i;
		div.appendChild(img);
		parent.appendChild(div);
	}
	document.getElementById(selected).classList.add('selected');
	loadLocation(selected);
}

function loadGuide(spirit, location, route, int) {
	$('#name').html('"'+data.spirit[spirit].date[location].ending[route][int].name+'"');
	for(var i=0;i<data.spirit[spirit].date[location].ending[route][int].guide.length;i++) {
		console.log(i);
		var guide = document.createElement('li');
		guide.classList.add('guidebox');
		guide.innerHTML = data.spirit[spirit].date[location].text[data.spirit[spirit].date[location].ending[route][int].guide[i]];
		document.getElementById('guidelist').appendChild(guide);
		//console.log(data.spirit[spirit].date[location].text[i])
	}
}

function loadRoute(spirit, location) {
	for(var i in data.spirit[spirit].date[location].ending) { //i want to delete ending part
		
		for(var t in data.spirit[spirit].date[location].ending[i]) {
			var route = document.createElement('li');
			route.classList.add('routebox');
			route.innerHTML = i + ' ' +(parseInt(t) + parseInt(1));
			route.id = i + '-' + t;
			document.getElementById('routelist').appendChild(route);
		}
	}
	$("#routelist li").click(function (event) {
    	
		$(this).css('background','#ca3e47');
		if(selectedRoute != '') {
			$('#'+selectedRoute).css('background','#313131');
		}
		selectedRoute = this.id;
		$('#guidelist').html('');
		loadGuide(selected, selectedLocation, this.id.split('-')[0], this.id.split('-')[1]);
		//$('#routelist').show();
		});
}

function loadLocation(spirit) {
	document.getElementById('locationlist').innerHTML = '';
	for(var i in data.spirit[spirit].date) {
		let location = document.createElement('li');
		location.classList.add('routebox');
		location.innerHTML = i;
		location.id = i;
		document.getElementById('locationlist').appendChild(location);
	}
	$("#locationlist li").click(function (event) {
	$(this).css('background','#ca3e47');
	if(selectedLocation != '') {
		$('#'+selectedLocation).css('background','#313131');
	}
	selectedLocation = $(this).html()
	loadRoute(selected, this.id);
	$('#routelist').show();
	});
}

document.addEventListener('DOMContentLoaded', function() {
	loadData();
init();
}, false);

$(document).ready(function() {
        $('.spirit').click(function() {
            //alert(this.id);
            $('#'+selected).removeClass('selected');
            $(this).addClass('selected');
            $('#routelist').hide();
            selected = this.id;
            localStorage['dalDDSelected'] = selected;
            loadLocation(this.id);
        });
    });

