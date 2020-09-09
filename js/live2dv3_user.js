var width = window.innerWidth;
var height = window.innerHeight;


//opt
var modelName;
var folderName;
var spines = [];

//misc
var selectedBgType = 0; //0 normal 1 kanban
var currentBgIndex = 0; //reduce data consumption & optimization

//bruh
var favorPoint = 0;
var favorLevel = 1;

var Live2DViewer = {
    model: '',
    checkInView: function(elem, partial) {
        var container = $("#bgNormal");
        var contHeight = container.height();
        var contTop = container.scrollTop();
        var contBottom = contTop + contHeight;

        var elemTop = $(elem).offset().top - container.offset().top;
        var elemBottom = elemTop + $(elem).height();

        var isTotal = (elemTop >= 0 && elemBottom <= contHeight);
        var isPart = ((elemTop < 0 && elemBottom > 0) || (elemTop > 0 && elemTop <= container.height())) && partial;

        return isTotal || isPart;
    },

    closeBgContainer: function() {
        document.getElementsByClassName('bgSelectorContainer')[0].classList.remove("in");
        document.getElementsByClassName('bgSelectorContainer')[0].classList.add("out");
        setTimeout(function() {
            document.getElementsByClassName('bgSelectorContainer')[0].style.display = "none";
            document.getElementsByClassName('bgSelectorContainer')[0].classList.remove("out");
        }, 100);
    },

    switchBgType: function(type, isAdd = false) {
        let bg = JSON.parse(httpGet('data/bg.json'));
        //to do without reload, faster loading
        selectedBgType = type;
        document.getElementsByClassName('bgCategory')[0].classList.remove('selected');
        document.getElementsByClassName('bgCategory')[1].classList.remove('selected');
        document.getElementsByClassName('bgCategory')[selectedBgType].classList.add('selected');
        //to do remove this
        if (selectedBgType == 0) {
            /*
            if (document.getElementById('bgNormal').innerHTML != "") {
                document.getElementById('bgNormal').style.display = 'flex';
                document.getElementById('bgKanban').style.display = 'none';
                return;
            }
            */
            //aa
            if(!isAdd) return;
            if (currentBgIndex >= Object.keys(bg.normal).length) {
                //skip loop
            } else {
                //load more
                var n = currentBgIndex;
                currentBgIndex += 20;
                if (currentBgIndex >= Object.keys(bg.normal).length) currentBgIndex = Object.keys(bg.normal).length;
                //better approach
                var key = Object.keys(bg.normal);
                for (; n < currentBgIndex; n++) {

                    let div = document.createElement('div');
                    div.classList.add('l2dv3-thumb');
                    div.style.content = 'url("' + key[n] + '")';
                    div.setAttribute("data-url", key[n]);
                    div.onclick = function() {
                        changeBackground(this.getAttribute('data-url'), Live2DViewer.model);
                        Live2DViewer.closeBgContainer();
                    }
                    if (n == currentBgIndex - 1 && n != key.length - 1) {
                        div.id = "scspy";
                    }

                    document.getElementById('bgNormal').appendChild(div);
                }
            }

            document.getElementById('bgNormal').style.display = 'flex';
            document.getElementById('bgKanban').style.display = 'none';
        } else if (selectedBgType == 1) {
            if (document.getElementById('bgKanban').innerHTML != "") {
                document.getElementById('bgKanban').style.display = 'flex';
                document.getElementById('bgNormal').style.display = 'none';
                return;
            }
            for (var i in bg.kanban) {
                let div = document.createElement('div');
                div.classList.add('l2dv3-thumb');
                div.style.content = 'url("' + i + '")';
                div.setAttribute("data-url", i);
                div.onclick = function() {
                    changeBackground(this.getAttribute('data-url'), Live2DViewer.model);
                    Live2DViewer.closeBgContainer();
                }
                document.getElementById('bgKanban').appendChild(div);
            }
            document.getElementById('bgKanban').style.display = 'flex';
            document.getElementById('bgNormal').style.display = 'none';
        } else {
            alert('what r u doing ?');
        }
    },

    loadMotion: function(model) {
        document.getElementById('motions').innerHTML = '';
        let motions = JSON.parse(httpGet(model)).FileReferences.Motions;
        for (var i in motions) {
            var opt = document.createElement('option');
            opt.value = i.toLowerCase();
            opt.innerHTML = i;
            document.getElementById('motions').appendChild(opt);
        }

        //select to idl
        for (var i = 0; i < document.getElementById('motions').options.length; i++) {
            if (document.getElementById('motions')[i].innerHTML.toLowerCase() == "idle") {
                document.getElementById('motions').selectedIndex = i;
                break;
            }
        }
    },

    bgLoader : function() {
        document.getElementsByClassName("bgSelectorContainer")[0].classList.add("in");
            setTimeout(function() {
                document.getElementsByClassName("bgSelectorContainer")[0].style.display = "table";
            }, 500);
    },

    openNav : function() {
        document.getElementsByClassName("l2dv3-sidenav")[0].style.right = "0px";
            document.getElementsByClassName("l2dv3-sidenav")[0].style.paddingLeft = "10px";
            document.getElementById("settingButton").style.marginRight = "260px";
    },

    closeNav : function() {
        document.getElementsByClassName("l2dv3-sidenav")[0].style.right = "-250px";
            document.getElementsByClassName("l2dv3-sidenav")[0].style.paddingLeft = "0px";
            document.getElementById("settingButton").style.marginRight = "0px";
        },

    init: function() {
        document.getElementById("settingButton").onclick = function() {
            if (!isSettingOpened) Live2DViewer.openNav();
            else
                Live2DViewer.closeNav();
            isSettingOpened = !isSettingOpened;
        }

        let models = JSON.parse(httpGet('data/live2dv3_models.json'));
        for (var i in models) {
            var opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = models[i];
            document.getElementById('models').appendChild(opt);
        }
        folderName = document.getElementById('models').options[document.getElementById('models').selectedIndex].value;
        modelName = folderName.replace(folderName.split('_')[2], 'new');
        //check _new first

        Live2DViewer.loadMotion('assets/res/basic/modle/bust_kanban/' + folderName + '/' + folderName.replace(folderName.split('_')[2], 'new') + '.model3.json')

        //bg3
        Live2DViewer.switchBgType(selectedBgType, true);

        //pos x
        document.getElementById('posx').value = width * 0.5;
        //pos y
        document.getElementById('posy').value = height * 0.5;

        $("#bgNormal").scroll(function() {
            if ($("#scspy").length) {
                if (Live2DViewer.checkInView('#scspy', true)) {
                    $('#scspy').removeAttr('id');
                    Live2DViewer.switchBgType(0, true);
                }
            }
        });

        document.getElementById('models').onchange = function(evt) {
            folderName = this.options[this.selectedIndex].value;

            modelName = folderName.replace(folderName.split('_')[2], 'new');


            $.ajax({
                url: 'assets/res/basic/modle/bust_kanban/' + folderName + '/' + modelName + '.model3.json',
                type: 'HEAD',
                error: function() {
                    //not _new
                    modelName = modelName.replace("_new", "");
                    changeModel('assets/res/basic/modle/bust_kanban/', folderName, modelName, Live2DViewer.model, Live2DViewer.model.bg)
                },
                success: function() {
                    //_new
                    changeModel('assets/res/basic/modle/bust_kanban/', folderName, modelName, Live2DViewer.model, Live2DViewer.model.bg)
                }
            });

            //motions;
            $.ajax({
                url: 'assets/res/basic/modle/bust_kanban/' + folderName + '/' + modelName + '.model3.json',
                type: 'HEAD',
                error: function() {
                    modelName = modelName.replace("_new", "");
                    Live2DViewer.loadMotion('assets/res/basic/modle/bust_kanban/' + folderName + '/' + modelName + '.model3.json')
                },
                success: function() {
                    Live2DViewer.loadMotion('assets/res/basic/modle/bust_kanban/' + folderName + '/' + modelName + '.model3.json')
                }
            })
        }

        //onchange motions
        document.getElementById('motions').onchange = function(evt) {
            let motionName = this.options[this.selectedIndex].value;
            Live2DViewer.model.startAnimation(motionName, 'base');
        }

        document.getElementById('posx').onchange = function(evt) {
            if (this.value == '') this.value = 0;
            changePosition(this.value, document.getElementById('posy').value, Live2DViewer.model);
        }
        document.getElementById('posy').onchange = function(evt) {
            if (this.value == '') this.value = 0;
            changePosition(document.getElementById('posx').value, this.value, Live2DViewer.model);
        }

    },

    initModel: function() {
        Live2DViewer.model = new l2dViewer({
            el: document.getElementById('L2dCanvas'),
            basePath: 'assets/res/basic/modle/bust_kanban/',
            modelName: modelName,
            folderName: folderName,
            sizeLimit: false,
            width: width,
            height: height,
            mobileLimit: false
        });
    }
}

var isSettingOpened = false;

        function openNav() {
            
        }

        function closeNav() {
            
        }
        

        function bgLoader() {
            
        }


window.onload = () => {
    Live2DViewer.init();
    Live2DViewer.initModel();

};