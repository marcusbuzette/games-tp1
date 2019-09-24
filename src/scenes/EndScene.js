import {CST} from './CST.js'

export class EndScene extends Phaser.Scene{

    levels;
    keyboard;
    constructor() {
        super({
            key:CST.SCENES.END
        })
    }

    init(data) {
        this.levels = data.levels
    }

    create () {
        this.add.text(300, 30, 'GAME OVER',{fontFamily: '"Roboto Condensed"',color: '#FFF'});
        this.add.text(600, 30, 'LABIRINTOS: ' + this.levels,{fontFamily: '"Roboto Condensed"',color: '#FFF'});
        this.keyboard = this.input.keyboard.addKeys("R,M");
        this.scale.resize(1008,70);
    }

    update() {
        if (this.keyboard.M.isDown ===  true) {
            this.scene.start(CST.SCENES.MENU)
        }
        if (this.keyboard.R.isDown ===  true) {
            this.scene.start(CST.SCENES.PHASE1, {playerVelocity: 40, mazeHeight :13,
                timeLeft: 100, starsCollected: 0, levels: 0});
        }
    }
}
