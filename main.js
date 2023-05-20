const config = {
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    //type: Phaser.AUTO,
    backgroundColor: '#000000',
    parent: 'physicsgame',
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0.8
            },
            enableSleep: true,
            debug: false
        }
    },
    scene: [Title, Level1, Loading1, Level2, Loading2, Level3, Loading3]
};

const game = new Phaser.Game(config);

let centerX = game.config.width/2;
let centerY = game.config.height/2;
let w = game.config.width;
let h = game.config.height;
let stars = 0;
let resultStart = false;