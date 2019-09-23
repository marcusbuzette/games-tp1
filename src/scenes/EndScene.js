import {CST} from './CST.js'

export class EndScene extends Phaser.Scene{

    levels;
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
        this.scale.resize(1008,70);
    }
}
