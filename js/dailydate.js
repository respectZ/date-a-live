//stored data
var selected = 'tohka';
var selectedLocation = '';
var selectedRoute = '';
var data = JSON.parse(httpGet('data/dailydate.json'));

var dailyDate = {
    loadData : function() {
        if (localStorage['dalDDSelected']) {
            selected = localStorage['dalDDSelected'];
        }
        if (localStorage['dalDDSelectedLocation']) {
            selectedLocation = localStorage['dalDDSelectedLocation'];
        }
        if (localStorage['dalDDSelectedRoute']) {
            selectedRoute = localStorage['dalDDSelectedRoute'];
        }
    },
    preloadImages : function() {
        for (var i in data.spirit) {
            new Image().src = data.spirit[i].data.img;
            for (var k in data.spirit[i].date) {
                for (var j in data.spirit[i].date[k].ending) {
                    for (var n in data.spirit[i].date[k].ending[j]) {
                        if (data.spirit[i].date[k].ending[j][n].cg) {
                            new Image().src = data.spirit[i].date[k].ending[j][n].cg;
                        }
                    }
                }
            }
        }
    },


    dismissLoading : function() {
        $('.loadingcontainer').addClass('out');
        setTimeout(function() {
            $('div').remove('.loadingcontainer');
        }, 500)
    },

    init : function() {
        //dismissLoading
        $('#dismissLoading').click(function(event) {
            dailyDate.dismissLoading();
        })
        //preload images
        dailyDate.preloadImages();
        let parent = document.getElementsByClassName('left')[0];
        for (var i in data.spirit) {
            var div = document.createElement('div');
            var img = document.createElement('div');
            div.classList.add('spirit');
            img.classList.add('thumb');
            //img.setAttribute('src',data.spirit[i].data.img)
            img.style.content = 'url("' + data.spirit[i].data.img + '")';
            div.id = i;
            div.appendChild(img);
            parent.appendChild(div);
        }
        document.getElementById(selected).classList.add('selected');
        dailyDate.loadLocation(selected);

        $('.spirit').click(function() {
            //alert(this.id);
            $('#' + selected).removeClass('selected');
            $(this).addClass('selected');
            $('#routelist').hide();
            selected = this.id;
            localStorage['dalDDSelected'] = selected;
            //nullify #1
            $('#locationlist').html('');
            $('#guidelist').html('');
            $('#routelist').html('');
            $('#name').html('');
            dailyDate.loadLocation(this.id);

            //nullify
            selectedLocation = '';
            selectedRoute = '';

            //banish cg
            $("div").remove(".cg");
        });
        $('.popup').click(function(event) {
            $('.poppedcg').addClass('out');
            //$(this).css('display','none');
            setTimeout(function() {
                $('.popup').css('display', 'none');
                $('.poppedcg').removeClass('out');
            }, 400)
        })

        
    },

    loadGuide : function(spirit, location, route, int) {
        $("div").remove(".cg");

        for (var i = 0; i < data.spirit[spirit].date[location].ending[route][int].guide.length; i++) {
            //console.log(i);
            var guide = document.createElement('li');
            guide.classList.add('guidebox');
            guide.innerHTML = data.spirit[spirit].date[location].text[data.spirit[spirit].date[location].ending[route][int].guide[i]];
            document.getElementById('guidelist').appendChild(guide);
            //console.log(data.spirit[spirit].date[location].text[i])

        }

        //edname
        $('#name').html('"' + data.spirit[spirit].date[location].ending[route][int].name + '"');
        //cg
        if (data.spirit[spirit].date[location].ending[route][int].cg) {
            let div = document.createElement('div');
            div.classList.add('cg');
            div.style.content = 'url("' + data.spirit[spirit].date[location].ending[route][int].cg + '")';
            document.getElementById('edinfo').appendChild(div);
            $('.poppedcg').css('content', div.style.content);
            $('.cg').click(function(event) {
                $('.popup').css('display', 'table');
            })
        }
    },

    loadRoute : function(spirit, location) {
        for (var i in data.spirit[spirit].date[location].ending) { //i want to delete ending part

            for (var t in data.spirit[spirit].date[location].ending[i]) {
                var route = document.createElement('li');
                route.classList.add('routebox');
                route.innerHTML = i + ' ' + (parseInt(t) + parseInt(1));
                route.id = i + '-' + t;
                document.getElementById('routelist').appendChild(route);
            }
        }
        $("#routelist li").click(function(event) {
            if (this.id == selectedRoute) return;
            $(this).css('background', '#ca3e47');
            if (selectedRoute != '') {
                $('#' + selectedRoute).css('background', '#313131');
            }
            selectedRoute = this.id;
            $('#guidelist').html('');
            dailyDate.loadGuide(selected, selectedLocation.substring(1), this.id.split('-')[0], this.id.split('-')[1]);
            //$('#routelist').show();
        });
    },

    loadLocation : function(spirit) {
        loadFavorite(spirit);
        for (var i in data.spirit[spirit].date) {
            let location = document.createElement('li');
            location.classList.add('routebox');
            location.innerHTML = data.spirit[spirit].date[i].name;
            location.id = 'd' + i;
            document.getElementById('locationlist').appendChild(location);
        }
        $("#locationlist li").click(function(event) {
            if (this.id == selectedLocation) return;

            //banish name
            $("#name").html('');
            //vanish cg
            $("div").remove(".cg");
            //banish route
            selectedRoute = '';
            //banish guide
            $('#guidelist').html('');

            $(this).css('background', '#ca3e47');
            if (selectedLocation != '') {
                $('#' + selectedLocation).css('background', '#313131');
                //console.log('ayy ' + selectedLocation);
            }
            selectedLocation = this.id;
            $('#routelist').html('');
            dailyDate.loadRoute(selected, this.id.substring(1));
            $('#routelist').show();
        });
    }

}

function loadData() {
    if (localStorage['dalDDSelected']) {
        selected = localStorage['dalDDSelected'];
    }
    if (localStorage['dalDDSelectedLocation']) {
        selectedLocation = localStorage['dalDDSelectedLocation'];
    }
    if (localStorage['dalDDSelectedRoute']) {
        selectedRoute = localStorage['dalDDSelectedRoute'];
    }
}

function preloadImages() {
    for (var i in data.spirit) {
        new Image().src = data.spirit[i].data.img;
        for (var k in data.spirit[i].date) {
            for (var j in data.spirit[i].date[k].ending) {
                for (var n in data.spirit[i].date[k].ending[j]) {
                    if (data.spirit[i].date[k].ending[j][n].cg) {
                        new Image().src = data.spirit[i].date[k].ending[j][n].cg;
                    }
                }
            }
        }
    }
}

function dismissLoading() {
    $('.loadingcontainer').addClass('out');
    setTimeout(function() {
        $('div').remove('.loadingcontainer');
    }, 500)
}

function init() {
    //preload images
    preloadImages();
    let parent = document.getElementsByClassName('left')[0];
    for (var i in data.spirit) {
        var div = document.createElement('div');
        var img = document.createElement('div');
        div.classList.add('spirit');
        img.classList.add('thumb');
        //img.setAttribute('src',data.spirit[i].data.img)
        img.style.content = 'url("' + data.spirit[i].data.img + '")';
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

    for (var i = 0; i < data.spirit[spirit].date[location].ending[route][int].guide.length; i++) {
        //console.log(i);
        var guide = document.createElement('li');
        guide.classList.add('guidebox');
        guide.innerHTML = data.spirit[spirit].date[location].text[data.spirit[spirit].date[location].ending[route][int].guide[i]];
        document.getElementById('guidelist').appendChild(guide);
        //console.log(data.spirit[spirit].date[location].text[i])

    }

    //edname
    $('#name').html('"' + data.spirit[spirit].date[location].ending[route][int].name + '"');
    //cg
    if (data.spirit[spirit].date[location].ending[route][int].cg) {
        let div = document.createElement('div');
        div.classList.add('cg');
        div.style.content = 'url("' + data.spirit[spirit].date[location].ending[route][int].cg + '")';
        document.getElementById('edinfo').appendChild(div);
        $('.poppedcg').css('content', div.style.content);
        $('.cg').click(function(event) {
            $('.popup').css('display', 'table');
        })
    }
}

function loadRoute(spirit, location) {
    for (var i in data.spirit[spirit].date[location].ending) { //i want to delete ending part

        for (var t in data.spirit[spirit].date[location].ending[i]) {
            var route = document.createElement('li');
            route.classList.add('routebox');
            route.innerHTML = i + ' ' + (parseInt(t) + parseInt(1));
            route.id = i + '-' + t;
            document.getElementById('routelist').appendChild(route);
        }
    }
    $("#routelist li").click(function(event) {
        if (this.id == selectedRoute) return;
        $(this).css('background', '#ca3e47');
        if (selectedRoute != '') {
            $('#' + selectedRoute).css('background', '#313131');
        }
        selectedRoute = this.id;
        $('#guidelist').html('');
        loadGuide(selected, selectedLocation.substring(1), this.id.split('-')[0], this.id.split('-')[1]);
        //$('#routelist').show();
    });
}

function loadLocation(spirit) {
    loadFavorite(spirit);
    for (var i in data.spirit[spirit].date) {
        let location = document.createElement('li');
        location.classList.add('routebox');
        location.innerHTML = data.spirit[spirit].date[i].name;
        location.id = 'd' + i;
        document.getElementById('locationlist').appendChild(location);
    }
    $("#locationlist li").click(function(event) {
        if (this.id == selectedLocation) return;

        //banish name
        $("#name").html('');
        //vanish cg
        $("div").remove(".cg");
        //banish route
        selectedRoute = '';
        //banish guide
        $('#guidelist').html('');

        $(this).css('background', '#ca3e47');
        if (selectedLocation != '') {
            $('#' + selectedLocation).css('background', '#313131');
            //console.log('ayy ' + selectedLocation);
        }
        selectedLocation = this.id;
        $('#routelist').html('');
        loadRoute(selected, this.id.substring(1));
        $('#routelist').show();
    });
}

function loadFavorite(spirit) {
    document.getElementById('gift1').style.content = 'url("assets/res/basic/icon/item/gift/' + data.spirit[spirit].data.like.gift[0] + '.png")';
    document.getElementById('gift2').style.content = 'url("assets/res/basic/icon/item/gift/' + data.spirit[spirit].data.like.food[0] + '.png")';
    $('#gift1d').html(data.spirit[spirit].data.like.gift[1])
    $('#gift2d').html(data.spirit[spirit].data.like.food[1])
}

document.addEventListener('DOMContentLoaded', function() {
    dailyDate.loadData();
    dailyDate.init();
}, false);

/*
$(document).ready(function() {
    $('.spirit').click(function() {
        //alert(this.id);
        $('#' + selected).removeClass('selected');
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
        $('.poppedcg').addClass('out');
        //$(this).css('display','none');
        setTimeout(function() {
            $('.popup').css('display', 'none');
            $('.poppedcg').removeClass('out');
        }, 400)
    })

    //dismissLoading
    $('#dismissLoading').click(function(event) {
        dailyDate.dismissLoading();
    })
});

*/

$(window).on("load", function() {
    dailyDate.dismissLoading();
});