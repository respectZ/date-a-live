var isSideNavOpened = false;

function loadContent(link) {
    $('#main-content').fadeOut(200, function() {
        $('#main-content').load(link + ' #main-content', function() {
            history.pushState(null, null, link);
            $('#main-content').fadeIn(200, function() {
            	if(link == "dailydate.html") {
                    if(typeof dailyDate == "undefined") {
                        $.getScript('js/dailydate.js', function() {
                            dailyDate.loadData();
                            dailyDate.init();
                            dailyDate.dismissLoading();
                        });
                    } else {
                       dailyDate.loadData();
                        dailyDate.init();
                        dailyDate.dismissLoading(); 
                    }
            	}
            	if(link == "live2dv3.html") {
                    if(typeof Live2DViewer == "undefined") {
                        $.getScript('js/live2dv3.js', function() {
                            $.getScript('js/live2dv3_user.js', function() {
                                Live2DViewer.init();
                                Live2DViewer.initModel();
                            })
                        })
                    } else {
                        Live2DViewer.init();
                        Live2DViewer.initModel();
                    }
            		
            	}
            });
        })
    })
}

$(document).ready(function() {
	$('#buttonNav').click(function() {
		if(isSideNavOpened) {
			$('#mySidenav').css('left','-250px');
			$('body').css('marginLeft','0px');
		} else {
			$('#mySidenav').css('left','0px');
			$('body').css('marginLeft','250px');
		}
		isSideNavOpened = !isSideNavOpened;
	})
});


$(function() {

    if (Modernizr.history) {
        // history is supported; do magical things
        $('ul.pagenav>li>a').on('click', function(e) {
            $('.selected').removeClass('selected');
            $(this).parent().addClass('selected');
            e.preventDefault();
            _href = $(this).attr("href");
            loadContent(_href);
            $('#buttonNav').click();



        })

    } else {

        // history is not supported; nothing fancy here

    }

});

$(window).bind("popstate", function() {
    link = location.pathname.replace(/^.*[\\/]/, ""); // get filename only
    loadContent(link);
});