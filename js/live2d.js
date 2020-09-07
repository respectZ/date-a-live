
var gModel;

const app = new PIXI.Application({
  view: document.getElementById('canvas'),
  autoStart: true
});

  const foreground = PIXI.Sprite.fromImage('./7_room2_a.jpg');
  app.stage.addChild(foreground);



function loadModel(model) {
    if(gModel) removeCurrentModel();
    var url = 'assets/'+model+'/'+model+'.model.json';
    if(model == 'bust_10507_new') url = 'assets/'+model+'/'+model+'.model3.json';

    PIXI.live2d.Live2DModel.fromModelSettingsFile(url).then(model => {
    app.stage.addChild(model);

    model.anchor.set(0.5, 0.5);
    model.position.set(innerWidth / 2, innerHeight / 2);
  
    const size = Math.min(innerWidth, innerHeight) * 0.8;
    model.width = size;
    model.height = size;
    model.internal.motionManager.startRandomMotion('idFavor33');
  
    // handle hitting
    model.on('hit', hitAreas => {
        if(hitAreas.includes('body')) {
            model.motion('tapBody');
        }
    
        if(hitAreas.includes('head')) {
            model.internal.motionManager.expressionManager.setRandomExpression();
        }
    });
    gModel = model;
  // handle dragging

  /*
  model.on('pointerdown', () => model.dragging = true);
  model.on('pointerup', () => model.dragging = false);
  model.on('pointermove', e => model.dragging && model.position.copyFrom(e.data.global));
  */

  //handle sounds
  });
}

function removeCurrentModel() {
    app.stage.removeChild(gModel);
}

function changeMotion(motion) {
    gModel.motion(motion);
}

function changeBackgroud(bg) {

}