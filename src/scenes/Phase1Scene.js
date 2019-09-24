import {CST} from './CST.js'
// import {EasyStar} from '../js/easystar-0.2.1.min.js'

export class Phase1Scene extends Phaser.Scene{

    player;
    playerVelocity;
    keyboard;
    maze = [];
    mazeWidth = 24;
    mazeHeight;
    tileSize = 33;
    mazeGraphics;
    mazeBlocks;
    keyObj;
    coins;
    exit;
    key;
    path;
    timeLeft;
    starsCollected;
    countDown;
    clockHud;
    starHud;
    textTime;
    levels;
    music;
    horizontal;
    rotating;

    //todo  music, timer, phases

    constructor() {
        super({
            key:CST.SCENES.PHASE1
        })
        this.path = [];
    }

    init(data) {
        this.playerVelocity = data.playerVelocity;
        this.mazeHeight = data.mazeHeight;
        this.timeLeft = data.timeLeft;
        this.starsCollected = data.starsCollected;
        this.levels = data.levels;


    }

    preload() {
        console.log(this.path)
        this.scale.resize(1008,70)
        this.horizontal = true;
        this.rotating = false;
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('pleft', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: this.anims.generateFrameNumbers('pdown', { start: 0, end: 0 }),
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('pright', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('pup', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('pdown', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.mazeGraphics = this.add.graphics(0,0);
        let moves = [];
        for(let i = 0; i < this.mazeHeight; i ++){
            this.maze[i] = [];
            for(let j = 0; j < this.mazeWidth; j ++){
                this.maze[i][j] = 1;

            }
        }
        let posX = 1;
        let posY = 1;
        this.maze[posX][posY] = 0;
        this.mazeBlocks = this.physics.add.staticGroup();
        this.mazeBlocks.enableBody = true;
        moves.push(posY + posY * this.mazeWidth);
        while(moves.length){
            let possibleDirections = "";
            if(posX+2 > 0 && posX + 2 < this.mazeHeight - 1 && this.maze[posX + 2][posY] == 1){
                possibleDirections += "S";
            }
            if(posX-2 > 0 && posX - 2 < this.mazeHeight - 1 && this.maze[posX - 2][posY] == 1){
                possibleDirections += "N";
            }
            if(posY-2 > 0 && posY - 2 < this.mazeWidth - 1 && this.maze[posX][posY - 2] == 1){
                possibleDirections += "W";
            }
            if(posY+2 > 0 && posY + 2 < this.mazeWidth - 1 && this.maze[posX][posY + 2] == 1){
                possibleDirections += "E";
            }
            if(possibleDirections){
                let move = Phaser.Math.Between(0, possibleDirections.length - 1);
                switch (possibleDirections[move]){
                    case "N":
                        this.maze[posX - 2][posY] = 0;
                        this.maze[posX - 1][posY] = 0;
                        this.path.push({i:posX - 2 , j: posY})
                        this.path.push({i:posX - 1 , j: posY})
                        posX -= 2;
                        break;
                    case "S":
                        this.maze[posX + 2][posY] = 0;
                        this.maze[posX + 1][posY] = 0;
                        this.path.push({i:posX + 2 , j: posY})
                        this.path.push({i:posX + 1 , j: posY})
                        posX += 2;
                        break;
                    case "W":
                        this.maze[posX][posY - 2] = 0;
                        this.maze[posX][posY - 1] = 0;
                        this.path.push({i:posX , j: posY - 2})
                        this.path.push({i:posX , j: posY - 1})
                        posY -= 2;
                        break;
                    case "E":
                        this.maze[posX][posY + 2]=0;
                        this.maze[posX][posY + 1]=0;
                        this.path.push({i:posX , j: posY + 2})
                        this.path.push({i:posX , j: posY + 1})
                        posY += 2;
                        break;
                }
                moves.push(posY + posX * this.mazeWidth);
            }
            else{
                let back = moves.pop();
                posX = Math.floor(back / this.mazeWidth);
                posY = back % this.mazeWidth;
            }
        }
    }

    create () {
        this.music = this.sound.add('music', {volume: 0.2, mute: false, loop: true});
        this.music.play();
        this.mazeGraphics.clear();
        this.keyboard = this.input.keyboard.addKeys("W, A, S, D,UP,LEFT,RIGHT,DOWN,R,M,F");
        this.cameras.main.setRoundPixels(true);
        this.cameras.main.setBackgroundColor('#3f2a14');
        this.keyObj = this.input.keyboard.addKey('R');

        this.coins = this.physics.add.group();
        this.clocks = this.physics.add.group();

        this.player = this.physics.add.sprite(30, 23, 'pdown', 0);
        this.cameras.main.setSize(1008,70)
        this.cameras.main.startFollow(this.player, true);
        this.randomItems(this.maze);
        this.randomKey()
        this.drawMaze();
        let easystar = new EasyStar.js();
        easystar.setGrid(this.maze);
        easystar.setAcceptableTiles([0]);

        easystar.calculate();

        window.player = this.player;
        // this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player,this.mazeBlocks);
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.clocks, this.collectClock, null, this);
        this.physics.add.collider(this.player, this.exit, this.exitFunction, null, this)
        this.physics.add.overlap(this.player, this.key, this.collectKey, null, this)
        // this.scale.resize(720,70);
        this.cameras.main.setBounds(0,0,720,(this.mazeHeight - 1) * this.tileSize);
        this.scale.game.height = this.mazeHeight * this.tileSize;




        this.countDown = setInterval(()=> {
            this.timeLeft -= 1;
            this.textTime.setText(this.timeLeft);

            if (this.timeLeft === 0) {
                this.scene.start(CST.SCENES.END, {levels: this.levels})
            }

            if (this.timeLeft <= 30) {
                // this.music.setSeek(0);
                this.music.setRate(1.3);
            }
        }, 1000);
        this.createHud();
    }

    update (time, delta) {

        if ((this.keyboard.D.isDown === true || this.keyboard.RIGHT.isDown)&& this.player.x < 790) {
            this.player.setVelocityX(this.playerVelocity)
            this.player.setVelocityY(0)
            this.player.play('right', true);
        } else if (this.keyboard.S.isDown === true || this.keyboard.DOWN.isDown) {
            this.player.setVelocityX(0)
            this.player.setVelocityY(this.playerVelocity);
            this.player.play('down', true);
        } else if (this.keyboard.A.isDown === true || this.keyboard.LEFT.isDown) {
            this.player.setVelocityX(-this.playerVelocity)
            this.player.setVelocityY(0)
            this.player.play('left', true);
        } else if (this.keyboard.W.isDown === true || this.keyboard.UP.isDown) {
            this.player.setVelocityX(0)
            this.player.setVelocityY(-this.playerVelocity)
            this.player.play('up', true);
        } else {
            this.player.setVelocityX(0)
            this.player.setVelocityY(0)
            this.player.play('turn', true);
        }

        if (this.keyboard.M.isDown ===  true) {
            this.scene.start(CST.SCENES.MENU)
        }

        if (this.keyboard.R.isDown ===  true) {
            clearInterval(this.countDown);
            this.path = [];
            this.music.pause();
            this.scene.start(CST.SCENES.PHASE1, {playerVelocity: 40, mazeHeight :13,
                timeLeft: 100, starsCollected: 0, levels: 0});
        }

        if (this.keyboard.F.isDown === true) {

            if(this.horizontal && !this.rotating) {
                clearInterval(this.countDown);
                this.scale.resize(50,720)
                this.horizontal = false
                this.rotating = true
            }
            if (!this.horizontal && !this.rotating){
                clearInterval(this.countDown);
                this.scale.resize(1008,70)
                this.horizontal = true
                this.rotating = true
            }

        }

        if (this.keyboard.F.isUp === true) {
            this.rotating = false
        }
        //
        // this.keyObj.on('up', (event)=> {
        //     console.log('viraaaaaa')
        // })

    }

    drawMaze(){

        for(let i = 0; i < this.mazeHeight; i ++){
            for(let j = 0; j < this.mazeWidth; j ++){
                if(this.maze[i][j] === 1){
                    if (i === this.mazeHeight -1 && j === this.mazeWidth -3) {
                        this.exit = this.physics.add.sprite((j) * this.tileSize, i * this.tileSize, 'red', 0).setScale(0.12);
                        this.exit.body.immovable = true;
                    } else {
                        this.mazeBlocks.create(j * this.tileSize, i * this.tileSize,'bush').setScale(2.5);
                    }
                }
            }
        }
    }

    randomItems () {
        for(let i = 0; i < this.mazeHeight ; i++) {
            for (let j = 0; j < (this.mazeWidth - 2) ; j++) {
                if(this.maze[i][j] === 0) {
                    let random = Phaser.Math.Between(0,40)
                    if (random === 2) {
                        this.coins.create(j * this.tileSize, i * this.tileSize, 'star').setScale(0.5);
                    }

                    if (random === 7) {
                        this.clocks.create(j * this.tileSize, i * this.tileSize, 'clock').setScale(0.05);
                    }
                }
            }
        }
    }

    randomKey () {
        this.path.shift()
        this.path.shift()
        const pos = Phaser.Math.RND.pick(this.path)
        this.key = this.physics.add.sprite(pos.j * this.tileSize, pos.i * this.tileSize,'key');
    }

    collectCoin (player, star) {
        this.playerVelocity += 5;
        this.sound.play('star', {volume: 0.5});
        this.starsCollected += 1;
        this.starText.setText(this.starsCollected)
        star.disableBody(true,true);
    }

    collectKey (player, key) {
        this.sound.play('key');
        this.key.disableBody(true, true);
        this.exit.setTexture('blue').setScale(0.05);
        this.add.sprite(950,30, 'key').setRotation(180).setScale(2).setScrollFactor(0)
    }

    collectClock (player, clock) {
        this.sound.play('clock', {volume: 0.5});
        clock.disableBody(true,true)
        this.timeLeft += 15;
    }

    exitFunction(player, exit) {
        if (this.key.active === false) {
            clearInterval(this.countDown);
            this.path = [];
            this.music.pause();
            this.scene.restart({playerVelocity: this.playerVelocity, mazeHeight :this.mazeHeight + 2,
                timeLeft: this.timeLeft, starsCollected: this.starsCollected, levels: this.levels + 1})
        } else {
            console.log('YOU SHALL NOT PASS!')
        }
    }

    createHud() {
        this.clockHud = this.physics.add.sprite(810, 15, 'clock').setScale(0.05);
        this.clockHud.setScrollFactor(0)
        this.textTime = this.add.text(840, 8, this.timeLeft, {fontFamily: '"Roboto Condensed"',color: '#FFF'})
        this.textTime.setScrollFactor(0)
        this.starHud = this.coins.create(810, 50, 'star').setScale(0.8);
        this.starHud.setScrollFactor(0)
        this.starText = this.add.text(840, 42, this.starsCollected, {fontFamily: '"Roboto Condensed"',color: '#FFF'})
        this.starText.setScrollFactor(0)

    }

}
