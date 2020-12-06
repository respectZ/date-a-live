//backup abyss diva, because it will throw an error if enable it
/*
pixi-spine.js:4717 Uncaught Error: Invalid timeline type for a bone: flipX (yu3)
"bust_11006_superKanban": {
    "0": {
      "path": "effect/dating/ui_superKanban_11006/meirenyubeijing",
      "action": "animation"
    }
  },

//natsumi lucky queen .skel file, idk
  "bust_11308_superKanban": {
    "0": {
      "path": "effect/dating/ui_superKanban_11308/effect_main_11308",
      "action": "animation"
    }
  },
*/

/*
to do :
10511 layering
12302 layering
offset = {
            y = 20,
            x = 127,
        },
        path = "effect/dating/ui_superKanban_10808/main_effect_10808_renwu",
offset = {
            y = -30,
            x = 15,
        },
        path = "effect/dating/ui_superKanban_12202/effect_main_12202",
 offset = {
            y = 46,
            x = -11,
        },
        path = "effect/dating/ui_superKanban_12504/junai_kanban",
        action = "texiao_qian",
*/

let charaEffect = JSON.parse(httpGet("data/bgeffect.json"));


var bgEffect = {
	list : {},
	isLoaded : false,

	backgroundManager : function(model, l2dViewer) {
		bgEffect.list = {};
		bgEffect.isLoaded = false;
		if(charaEffect[model]) {
			console.log('bgeffect exists, ' + model)
			var tempArr = [];
			for(var i in charaEffect[model]) {
				tempArr.push('assets/res/basic/' + charaEffect[model][i]['path'] + '.json:' + charaEffect[model][i]['action'])
			}
			bgEffect.backgroundEffect.add(tempArr, l2dViewer);
		} else {
			bgEffect.isLoaded = true;
		}
	},

	backgroundEffect : {
		add : function(data, l2dViewer) {
			//let loader = new PIXI.loader();
			for(var i=0;i<data.length;i++) {
				PIXI.loader.add('bgEffect' + i, data[i].split(':')[0]);
			}
			PIXI.loader.load((loader, res) => {
				for(var i=0;i<data.length;i++) {
					const s = new PIXI.spine.Spine(res['bgEffect' + i].spineData);
					//to do idk how to automaticly set based resolution, so i'll set this for by screen reso / 2
					s.scale.x = s.scale.y = 1;
					s.x = window.innerWidth / 2;
					s.y = window.innerHeight / 2;

					s.state.setAnimation(0, data[i].split(':')[1], true);
					l2dViewer.app.stage.addChild(s);
					bgEffect.list['bgEffect' + i] = {}
					bgEffect.list['bgEffect' + i].x = s.x;
					bgEffect.list['bgEffect' + i].y = s.y;
					bgEffect.list['bgEffect' + i].scale = s.scale.x;
				}
				bgEffect.addSetting(l2dViewer);
				PIXI.loader.reset();		
			});
		}
	},

	addSetting : function(l2dViewer) {
		document.getElementById('bg-effect').innerHTML = '';
		var n = 0; //Spine index to do
		//spine finder
		for(;n<l2dViewer.app.stage.children.length;n++) {
			if(l2dViewer.app.stage.children[n].constructor.name == "Spine") {
				break;
				
			}
		}
		for(var i in bgEffect.list) {
			let div = document.createElement('div');
			div.classList.add('l2dv3-collapsible');

			let x = document.createElement('input');
			x.type = 'number';
			x.min = 0;
			x.value = bgEffect.list[i].x;
			x.id = i + 'x';
			x.name = i + 'x';

			let y = document.createElement('input');
			y.type = 'number';
			y.min = 0;
			y.value = bgEffect.list[i].y;
			y.id = i + 'y';
			y.name = i + 'y';

			let scale = document.createElement('input');
			scale.type = 'number';
			scale.min = 50;
			scale.value = bgEffect.list[i].scale * 100;
			scale.id = i + 'scale';
			scale.name = i + 'scale';

			//label
			let label1 = document.createElement('label');
			label1.for = x.name
			label1.innerHTML = 'X';
			let label2 = document.createElement('label');
			label2.for = y.name
			label2.innerHTML = 'Y';
			let label3 = document.createElement('label');
			label3.for = scale.name
			label3.innerHTML = 'Scale';

			//to do customization effect
			x.setAttribute('index', n);
			y.setAttribute('index', n);
			scale.setAttribute('index', n);
			x.onchange = function() { bgEffect.changePosX(this.getAttribute('index'), this.value, l2dViewer) };
			y.onchange = function() { bgEffect.changePosY(this.getAttribute('index'), this.value, l2dViewer) };
			scale.onchange = function() { bgEffect.changeScale(this.getAttribute('index'), this.value, l2dViewer) };

			//t
			let t = document.createElement('div');
			let t1 = document.createElement('div');
			let t2 = document.createElement('div');
			let mainButton = document.createElement('button');
			mainButton.classList.add('l2dv3-collapsible-main');
			mainButton.classList.add('customButton');
			mainButton.innerHTML = i;

			t.appendChild(x);
			t1.appendChild(y);
			t2.appendChild(scale);

			div.appendChild(label1);

			div.appendChild(t);
			div.appendChild(label2);

			div.appendChild(t1);
			div.appendChild(label3);

			div.appendChild(t2);
			document.getElementById('bg-effect').appendChild(mainButton)
			document.getElementById('bg-effect').appendChild(div);
			n++;
		}
		bgEffect.isLoaded = true;
		let cc = document.getElementsByClassName('l2dv3-collapsible-main');
		for(var i=0;i<cc.length;i++) {
		cc[i].addEventListener("click", function() {
			let content = this.nextElementSibling;
			if(content.style.lineHeight != 0) {
				//content.style.display = 'none';
				content.style.lineHeight = 0;
				content.style.height = 0;
			} else {
				//content.style.display = 'block';
				content.style.lineHeight = 'normal';
				content.style.height = '150px';
			}
		})
		}
		
	},

	changePosX : function(index, value, l2dViewer) {
		l2dViewer.app.stage.children[index].x = value;
	},
	changePosY : function(index, value, l2dViewer) {
		l2dViewer.app.stage.children[index].y = value;
	},
	changeScale : function(index, value, l2dViewer) {
		l2dViewer.app.stage.children[index].scale.x = value / 100;
		l2dViewer.app.stage.children[index].scale.y = value / 100;
	},
};

