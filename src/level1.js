class Loading1 extends Phaser.Scene {
    constructor() {
        super('loading1');
    }

    create()
    {
        this.scene.start('level1');
    }
}

class Level1 extends Phaser.Scene {
    constructor() {
        super('level1');
    }

    preload()
    {
        this.load.image('restart', './assets/restart.png');
        this.load.image('arrow', './assets/curlyarrow.png');
        this.load.image('play', './assets/playbutton.png');
        this.load.image('star', './assets/star.png');
        this.load.image('circle', './assets/circle.png');
    }

    create()
    {
        this.matter.world.setBounds(0, 0, w, h, 32, true, true, false, true);

        let restartTextOn = false;
        let restartText = this.add.text(w-100, 150)
            .setStyle({ fontSize: `24px`, fontFamily: 'Indie Flower', color: '#ffffff' });

        let restartButton = this.add.image(w-100, 10, 'restart').setOrigin(0,0).setScale(0.5)
            .setInteractive()
            .on('pointerover', () => {
                restartText.setAlpha(1);
                restartText.setText("Restart?");
                restartTextOn = true;
            })
            .on('pointerout', () => {
                if (restartTextOn) {
                    restartText.setAlpha(0);
                    restartTextOn = false;
                }
            })
            .on('pointerdown', () => {
                this.scene.start('loading1');
            });

        const lineCategory = this.matter.world.nextCategory();
        const ballsCategory = this.matter.world.nextCategory();

        const sides = 4;
        const size = 15;
        const distance = size;
        const stiffness = 0.1;
        const lastPosition = new Phaser.Math.Vector2();
        const options = { friction: 0, frictionAir: 0, restitution: 0, ignoreGravity: true, inertia: Infinity, isStatic: true, angle: 0, collisionFilter: { category: lineCategory } };

        let current = null;
        let previous = null;

        const curves = [];
        let curve = null;

        const graphics = this.add.graphics();

        this.input.on('pointerdown', function (pointer)
        {

            lastPosition.x = pointer.x;
            lastPosition.y = pointer.y;

            previous = this.matter.add.polygon(pointer.x, pointer.y, sides, size, options);

            curve = new Phaser.Curves.Spline([ pointer.x, pointer.y ]);

            curves.push(curve);

        }, this);

        this.input.on('pointermove', function (pointer)
        {

            if (pointer.isDown)
            {
                const x = pointer.x;
                const y = pointer.y;

                if (Phaser.Math.Distance.Between(x, y, lastPosition.x, lastPosition.y) > distance)
                {
                    options.angle = Phaser.Math.Angle.Between(x, y, lastPosition.x, lastPosition.y);

                    lastPosition.x = x;
                    lastPosition.y = y;

                    current = this.matter.add.polygon(pointer.x, pointer.y, sides, size, options);

                    this.matter.add.constraint(previous, current, distance, stiffness);

                    previous = current;

                    curve.addPoint(x, y);

                    graphics.clear();
                    graphics.lineStyle(size * 1.5, 0xffffff);

                    curves.forEach(c =>
                    {
                        c.draw(graphics, 64);
                    });
                }
            }

        }, this);

        const ball = this.matter.add.image(300, 400, 'circle')
            .setStatic(true);
        
        let playTextOn = false;
        let playText = this.add.text(100, h*0.5+200)
            .setStyle({ fontSize: `24px`, fontFamily: 'Indie Flower', color: '#ffffff' });

        let playButton = this.add.image(100, h*0.5, 'play').setOrigin(0,0).setScale(0.3)
        .setInteractive()
        .on('pointerover', () => {
            playText.setAlpha(1);
            playText.setText("Start moving the ball?");
            playTextOn = true;
        })
        .on('pointerout', () => {
            if (playTextOn) {
                playText.setAlpha(0);
                playTextOn = false;
            }
        })
        .once('pointerdown', () => {
            ball.setStatic(false)
            .setCircle()
            .setFriction(0.005)
            .setBounce(0.1);
        });

        let star = this.matter.add.image(800, 600, 'star').setStatic(true).setScale(0.1);
        star.setOnCollide(this.handleStarCollision);
    }

    handleStarCollision(data) {
        const {bodyA, bodyB} = data;   
        const goA = bodyA.gameObject; 
        goA.destroy(true);
    }
}