import {CST} from './CST.js'

export class BootScene extends Phaser.Scene{
    constructor() {
        super({
            key:CST.SCENES.BOOT
        })
    }

    init() {

    }

    preload() {
        this.load.image('sky', 'img/sky.png');
    }

    create() {
        // this.scale.resize(1008,70);
        this.scene.start(CST.SCENES.LOAD)
    }
}
