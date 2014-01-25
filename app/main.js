var APPLE_PANIC = 1;
var MONKEY_PANIC = 0;
var SOUND_EFFECT = 1;
var CLEAN = 0;

function monkey(){ 
    MONKEY_PANIC = 1; 
    SOUND_EFFECT = 2;
}
function soundOff(e) {
    console.log(e);
    MONKEY_PANIC = 0;
    APPLE_PANIC = 0;
    SOUND_EFFECT = 0;
}
function soundOn() {
    MONKEY_PANIC = 0;
    APPLE_PANIC = 1;
    SOUND_EFFECT = 1;
}
function soundCtrl(flag) {
    console.log('flag: ' ,flag);
    if (flag == 'Sound Off'){
        $('#sound-ctrl').text('Sound On');
        soundOff();
    }
    if (flag == 'Sound On'){
        $('#sound-ctrl').text('Sound Off');
        soundOn();
    }
}

window.onload = function() {
var SCREEN_WIDTH  = 320;
var SCREEN_HEIGHT = 320;
var STAGE_OFFSET  = 45;
var TOTAL_APPLE_NUM = 0;
var SCORE = 0;
var MONKEY_TIME = 1000;

    enchant();
    function ini(callback){      
        var game = new Game(320, 320);
        game.rootScene.backgroundColor = 'black';
        game.preload('tachi_wbg.png', 'icon0.png','avatarBg1.png','avatarBg2.png','avatarBg3.png', 'effect0.png', 'boomb.mp3', 'monkey.mp3'); 
        callback(game);
        game.start();    
    }

    ini(function(game){
        Tachikoma = Class.create(Sprite, // Spriteクラスを継承
        {
            initialize: function(x, y, frame) { //初期化する
                Sprite.call(this, 67, 61); //Spriteオブジェクトを初期化
                this.image = game.assets['tachi_wbg.png'];
                this.x = x;
                this.y = y;
        
                this.tx = this.x; //行きたい場所のX座標
                this.ty = this.y; //行きたい場所のY座標
                this.frame = (frame == undefined ? 0:frame);
                game.rootScene.addChild(this);
            },
            //enterframeイベントのリスナーを定義する
            onenterframe: function() {
                slow = 10; //クマが行きたい場所へ近づく遅さ
                //行きたい場所へ近づく
                this.x += (this.tx - this.x) / slow;
                this.y += (this.ty - this.y) / slow;
                if(this.tx > 150 && (this.tx - this.x) <= 20 )  this.frame = 2;
                if(this.tx < 150 )  this.frame = 2;
                // console.log('xy', this.tx - this.x);
            }
        });
        Fruits = Class.create(Sprite, // Spriteクラスを継承
        {
            initialize: function(frame,l) { //初期化する
                Sprite.call(this, 16, 16); //Spriteオブジェクトを初期化
                this.image = game.assets['icon0.png'];

                // ランダムな場所にフルーツを表示する
                this.x = Math.random() * 300 + 10; // Math.random()を使うと0から1未満の
                this.y = Math.random() * 200 + 100; // ランダムな少数が得られるのでそれで座標をつくる
                this.frame = frame;
                game.rootScene.addChild(this);
                TOTAL_APPLE_NUM++;
            },
            onenterframe: function() {
                if (this.within(tachikoma)) {
                    console.log(SOUND_EFFECT);
                    if (SOUND_EFFECT != 0){
                        if (SOUND_EFFECT === 1)
                            var gaaa = game.assets['boomb.mp3'].clone();
                        if (SOUND_EFFECT === 2)
                            var gaaa = game.assets['monkey.mp3'].clone();
                        gaaa.play();
                    }
                    // 自分自身(フルーツ)を画面から消す
                    var b = new Blast(this.x + 20, this.y + 20);
                    game.rootScene.removeChild(this);
                    SCORE++;
                    if (SCORE == MONKEY_TIME){
                        $('body').append("<button id='no-apple' onclick='monkey()''>我不想再看到蘋果了</button>");
                    }                    
                }
            }
        });
        var Blast = enchant.Class.create(enchant.Sprite, {
            initialize: function(x, y) {
                enchant.Sprite.call(this, 16, 16);
                this.x = x;
                this.y = y;
                this.image = game.assets['effect0.png'];
                this.scaleX = 3;
                this.scaleY = 3;
                this.tl.cue({
                    0: function() {
                        this.frame++;
                    },
                    5: function() {
                        this.frame++;
                    },
                    10: function() {
                        this.frame++;
                    },
                    15: function() {
                        this.frame++;
                    },
                    20: function() {
                        game.rootScene.removeChild(this);
                    }
                });
                game.rootScene.addChild(this);
            }
        });        
       game.onload = function() {    
        var scene = game.rootScene;
            scene.backgroundColor = "#cff";        
            
        var scoreLabel = new ScoreLabel(10, 15);
            scene.addChild(scoreLabel);

            var stage = new Group();
            stage.y = STAGE_OFFSET;
            scene.addChild(stage)            
            

            var bg = new AvatarBG(1);
            var bg2 = new AvatarBG(1);
            stage.addChild(bg);

            tachikoma = new Tachikoma(150, 150, 1);
            tachikoma.score = 0;
            stage.addChild(tachikoma);

            scene.onenterframe = function() {
                scoreLabel.score = SCORE;
                bg.scroll(game.frame*2);
                if (APPLE_PANIC === 1) {
                    SOUND_EFFECT = 1;
                    fruits = new Fruits(15);
                }
                if (MONKEY_PANIC === 1) {
                    APPLE_PANIC = 0;
                    SOUND_EFFECT = 2;
                    fruits = new Fruits(44);
                }
                if (CLEAN != 1)
                    fruits = new Fruits(15);
            };

            scene.addEventListener('touchend', function(event) { //eventにタッチされた座標が入ってくる
                tachikoma.frame = 0;
                tachikoma.tx = event.x; //クマの「行きたい場所」にタッチされたX座標を指定
                tachikoma.ty = event.y; //クマの「行きたい場所」にタッチされたY座標を指定
            });
        }

    });
}