//stored data
var selected = 'tohka';
var selectedLocation = '';
var selectedRoute = '';
var data = JSON.parse(httpGet('spirits.json'));

window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

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
	//console.log(location);
	//vanish cg
	$("div").remove(".cg");

	for(var i=0;i<data.spirit[spirit].date[location].ending[route][int].guide.length;i++) {
		console.log(i);
		var guide = document.createElement('li');
		guide.classList.add('guidebox');
		guide.innerHTML = data.spirit[spirit].date[location].text[data.spirit[spirit].date[location].ending[route][int].guide[i]];
		document.getElementById('guidelist').appendChild(guide);
		//console.log(data.spirit[spirit].date[location].text[i])

	}

	//edname
	$('#name').html('"'+data.spirit[spirit].date[location].ending[route][int].name+'"');
	//cg
	if(data.spirit[spirit].date[location].ending[route][int].cg) {
		let div = document.createElement('div');
		div.classList.add('cg');
		div.style.content = 'url("cg/'+spirit+'/'+data.spirit[spirit].date[location].ending[route][int].cg+'")';
		document.getElementById('edinfo').appendChild(div);
		$('.poppedcg').css('content',div.style.content);
		$('.cg').click(function (event) {
			$('.popup').css('display','table');
		})
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
    	if(this.id == selectedRoute) return;
		$(this).css('background','#ca3e47');
		if(selectedRoute != '') {
			$('#'+selectedRoute).css('background','#313131');
		}
		selectedRoute = this.id;
		$('#guidelist').html('');
		loadGuide(selected, selectedLocation.substring(1), this.id.split('-')[0], this.id.split('-')[1]);
		//$('#routelist').show();
		});
}

function loadLocation(spirit) {

	for(var i in data.spirit[spirit].date) {
		let location = document.createElement('li');
		location.classList.add('routebox');
		location.innerHTML = data.spirit[spirit].date[i].name;
		location.id = 'd'+i;
		document.getElementById('locationlist').appendChild(location);
	}
	$("#locationlist li").click(function (event) {
		if(this.id == selectedLocation) return;
	$(this).css('background','#ca3e47');
	if(selectedLocation != '') {
		$('#'+selectedLocation).css('background','#313131');
		console.log('ayy ' + selectedLocation);
	}
	selectedLocation = this.id;
	$('#routelist').html('');
	loadRoute(selected, this.id.substring(1));
	$('#routelist').show();

	//banish cg
	$("div").remove(".cg");
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
            //nullify #1
            $('#locationlist').html('');
            $('#guidelist').html('');
            $('#routelist').html('');
            $('#name').html('');
            loadLocation(this.id);

            //nullify
            selectedLocation = '';
            selectedRoute = '';

            //banish cg
            $("div").remove(".cg");
        });
        $('.popup').click(function(event) {
        	$(this).css('display','none');
        })
    });

