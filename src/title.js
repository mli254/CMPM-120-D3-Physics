class Title extends Phaser.Scene {
    constructor() 
    {
        super('title');
    }

    preload() 
    {
        this.load.image('restart', './assets/restart.png');
        this.load.image('arrow', './assets/curlyarrow.png');
        this.load.image('play', './assets/playbutton.png');
        this.load.image('star', './assets/star.png');
        this.load.image('circle', './assets/circle.png');
        this.load.image('logo', './assets/logo.png');
        this.load.image('titleimg', './assets/titlescreen.png');
        this.load.image('titlename', './assets/title.png');
        this.load.image('bg', './assets/bg.png');
    }

    create()
    {
        this.cameras.main.fadeIn(750, 0,0,0);

        this.logo = this.add.image(w*0.5, h*0.5, 'logo').setOrigin(0.5).setScale(0.3);
        this.logo.alpha = 0;

        this.time.delayedCall(1000, () => {
            this.add.tween({
                targets: this.logo,
                alpha: {from: 0, to: 1},
                duration: 1000
            });
        })

        this.time.delayedCall(2500, () => {
            this.dummyFont = this.add.text(0,0,"e")
                .setStyle({ fontSize: `12px`, fontFamily: 'Indie Flower', color: '#ffffff' })
                .setAlpha(0);
            this.add.tween({
                targets: this.logo,
                alpha: {from: 1, to: 0},
                duration: 1000
            });
        })

        this.time.delayedCall(4000, () => {
            this.titleimg = this.add.image(0, 0, 'titleimg').setOrigin(0,0).setAlpha(0);
            this.add.tween({
                targets: this.titleimg,
                alpha: {from: 0, to: 1},
                duration: 500
            });

            this.time.delayedCall(1000, () => {
                this.titleText = this.add.image(w*0.5, h*0.65, 'titlename')
                    .setOrigin(0.5)
                    .setAlpha(0)

                this.add.tween({
                    targets: this.titleText,
                    alpha: {from: 0, to: 1},
                    duration: 1000
                });
            })
        })

        

        this.time.delayedCall(5000, () => {
            this.startText = this.add.text(w*0.5, h*0.75+100, "Click to move to the next scene.")
                .setOrigin(0.5)    
                .setStyle({ fontSize: `24px`, fontFamily: 'Indie Flower', color: '#ffffff' })
                .setAlpha(0);

            this.add.tween({
                targets: this.startText,
                alpha: {from: 0, to: 1},
                duration: 1000
            });
        })

        // fade to black transition to next scene
        this.time.delayedCall(5000, () => {
            this.input.on('pointerdown', function () 
            {
                this.cameras.main.fadeOut(1000, 0,0,0);
                this.time.delayedCall(1001, () => {
                    this.scene.start('level1');
                })
            }, this);
        })
    }
}