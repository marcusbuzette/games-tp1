import {CST} from './CST.js'

export class MenuScene extends Phaser.Scene{

    music;
    constructor() {
        super({
            key:CST.SCENES.MENU
        })
    }

    init(data) {
    }

    create() {
        this.add.text(200, 30, 'SUPER MAZE RUNNER',{fontFamily: '"Roboto Condensed"',color: '#FFF'});
        this.add.text(600, 30, '<   PRESSIONE ESPAÇO   >',{fontFamily: '"Roboto Condensed"',color: '#FFF'});
        this.scale.resize(1008,70);

        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === 32) {
                this.scene.start(CST.SCENES.PHASE1, {playerVelocity: 40, mazeHeight :13,
                    timeLeft: 100, starsCollected: 0, levels: 0})
            }
        })
    }
}
