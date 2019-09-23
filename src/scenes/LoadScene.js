import {CST} from './CST.js'

export class LoadScene extends Phaser.Scene{
    constructor() {
        super({
            key:CST.SCENES.LOAD
        })
    }

    init() {

    }

    preload() {
        // let progressBar = this.add.sprite(this.world.centerX,250,'progressBar');
        // progressBar.anchor.set(.5);

        this.load.image('sky', 'img/sky.png');
        this.load.image('key', 'img/key.png');
        this.load.image('bush', 'img/bush.png');
        this.load.image('red', 'img/red.png');
        this.load.image('blue', 'img/blue.png');
        this.load.image('clock', 'img/clock.png');
        this.load.image('ground', 'img/platform.png');
        this.load.image('star', 'img/star.png');
        this.load.image('bomb', 'img/bomb.png');
        this.load.spritesheet('pdown',
            'img/Character_Down.png',
            { frameWidth: 32, frameHeight: 28 }
        );
        this.load.spritesheet('pleft',
            'img/Character_Left.png',
            { frameWidth: 32, frameHeight: 28 }
        );
        this.load.spritesheet('pup',
            'img/Character_Up.png',
            { frameWidth: 32, frameHeight: 28 }
        );
        this.load.spritesheet('pright',
            'img/Character_Right.png',
            { frameWidth: 32, frameHeight: 28 }
        );
        this.load.audio('music', 'sfx/music.ogg')
        this.load.audio('clock', 'sfx/zapsplat_industrial_sandpaper_sheet_movement_002_15238.mp3')
        this.load.audio('key', 'sfx/zapsplat_industrial_metal_cabinet_bolt_unlock_open_002_20772.mp3')
        this.load.audio('star', 'sfx/zapsplat_multimedia_game_star_win_gain_x1_12387.mp3')

        let loadingBar = this.add.graphics({
            fillStyle:{
                color: 0xffffff
            }
        })

        this.load.on('progress', (percetage) => {
            loadingBar.fillRect(0, this.game.renderer.height / 2 , this.game.width * percetage, 10)
        })

        this.load.on('complete', ()=> {
            this.scene.start(CST.SCENES.MENU)
        })
    }

    create() {
        // this.scale.resize(1008,70);

    }
}
