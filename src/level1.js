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

    create()
    {
        // resetting globals
        stars = 0;
        resultStart = false;

        // setting the world bounds; omits the left side, where the menu is
        this.matter.world.setBounds(300, 0, w-300, h, 32, true, true, false, true);

        this.add.rectangle(0, 0, w, h*0.75, 0x303030).setOrigin(0,0);

        // creates "restart" button in the top-right corner
        let restartTextOn = false;
        let restartText = this.add.text(w-150, 150)
            .setStyle({ fontSize: `24px`, fontFamily: 'Indie Flower', color: '#ffffff' });

        let restartButton = this.add.image(w-150, 50, 'restart').setOrigin(0,0).setScale(0.5)
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

        // draws the line when the player holds and drags the mouse cursor across the screen
        const lineCategory = this.matter.world.nextCategory();

        // configuring the matter polygons
        const sides = 4; // creates square-shaped hit-boxes
        const size = 10; // thickness of the line
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

        // creates the ball for the level
        const ball = this.matter.add.image(700, 400, 'circle')
            .setStatic(true); // initially immovable

        // create the star for the level
        let star = this.matter.add.image(1400, 600, 'star').setStatic(true).setScale(0.08).setTint(0x4dd0e1);
        star.setOnCollide(this.handleStarCollision);

        // creates the menu in the top-left corner, which includes the play button
        let menu = this.add.container(200, h*0.5-300);
        let menuOutline = this.add.rectangle(0, 0, 305, 405, 0xffffff).setOrigin(0.5);
        let menuBox = this.add.rectangle(0, 0, 300, 400, 0x000000).setOrigin(0.5);
        let menuText = this.add.text(0, -100)
            .setOrigin(0.5)
            .setText("Score:")
            .setStyle({ fontSize: `24px`, fontFamily: 'Indie Flower', color: '#ffffff' });
        let menuStar = this.add.image(0, -50, 'star')
            .setOrigin(0.5)
            .setScale(0.05);    

        // creates the play button; the ball will drop once it is pressed once
        let playTextOn = false;
        let playText = this.add.text(0, 150)
            .setOrigin(0.5)
            .setStyle({ fontSize: `24px`, fontFamily: 'Indie Flower', color: '#ffffff' });

        let playButton = this.add.image(0, 75, 'play').setOrigin(0.5).setScale(0.2)
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
                // only perform this action once per level restart
                ball.setStatic(false)
                    .setCircle()
                    .setFriction(0.001)
                    .setBounce(0.1);
            });

        // add menu components to the menu container
        menu.add(menuOutline);
        menu.add(menuBox);
        menu.add(menuText);
        menu.add(menuStar);
        menu.add(playText);
        menu.add(playButton);        
    }

    update() 
    {
        if (stars==1 && resultStart==false) {
            // add a star to the "score" once the star is hit by the ball
            let menuStar = this.add.image(200, h*0.5-350, 'star')
                .setOrigin(0.5)
                .setScale(0.05)
                .setTint(0x4dd0e1);  

            // set the boolean to true so that this action is not performed continuously
            resultStart=true;

            // create a container to store the result screen
            let resultScreen = this.add.container(w*0.5, h*0.5);
            
            // create box + white outline
            let resultOutline = this.add.rectangle(0, 0, 600, 900, 0xffffff)
                .setOrigin(0.5);
            let resultBox = this.add.rectangle(0, 0, 590, 890, 0x000000)
                .setOrigin(0.5);

            // create result screen text
            let resultTitle = this.add.text(0, -300)
                .setOrigin(0.5)
                .setStyle({ fontSize: `60px`, fontFamily: 'Indie Flower', color: '#ffffff' })
                .setText("Complete!");
            let resultScore = this.add.text(0, 100)
                .setOrigin(0.5)
                .setStyle({ fontSize: `48px`, fontFamily: 'Indie Flower', color: '#ffffff' })
                .setText(`You scored ${stars}/1`);
            let resultText = this.add.text(0, 400)
                .setOrigin(0.5)
                .setStyle({ fontSize: `40px`, fontFamily: 'Indie Flower', color: '#ffffff' })
                .setText("Try Again?");
            let resultRestart = this.add.image(0, 300, 'restart').setOrigin(0.5).setScale(0.5)
                .setInteractive()
                .on('pointerdown', () => {
                    this.scene.start('loading1');
                });
            let scoreIcon = this.add.image(0, -50, 'star').setOrigin(0.5).setScale(0.2);

            // add option to move to next level
            let nextHover = false;
            let nextLevel = this.add.text(0, 200)
                .setOrigin(0.5)
                .setStyle({ fontSize: `46px`, fontFamily: 'Indie Flower', color: '#ffffff' })
                .setText("Go to Next Level?")
                .setInteractive()
                .on('pointerover', () => {
                    nextLevel.setTint(0x4dd0e1);
                    nextHover = true;
                })
                .on('pointerout', () => {
                    if (nextHover) {
                        nextLevel.setTint(0xffffff);
                        nextHover = false;
                    }
                })
                .on('pointerdown', () => {
                    this.scene.start('level2')
                });
            
            // add result screen components to the container
            resultScreen.add(resultOutline);
            resultScreen.add(resultBox);
            resultScreen.add(resultTitle);
            resultScreen.add(resultScore);
            resultScreen.add(resultRestart);
            resultScreen.add(resultText);
            resultScreen.add(scoreIcon);
            resultScreen.add(nextLevel);
            resultScreen.setAlpha(0);

            this.add.tween({
                targets: resultScreen,
                alpha: {from: 0, to: 1},
                duration: 1000
            });
        }
    }

    handleStarCollision(data) {
        const {bodyA, bodyB} = data;   
        const goA = bodyA.gameObject; 
        goA.destroy(true);
        stars+=1;  
    }
}