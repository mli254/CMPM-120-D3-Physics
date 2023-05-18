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
    }

    create ()
    {
        this.matter.world.setBounds(0, 0, w, h, 32, true, true, false, true);

        //let button = this.add.image(0, 0, 'restart').setOrigin(0,0);

        const lineCategory = this.matter.world.nextCategory();
        const ballsCategory = this.matter.world.nextCategory();
        const starsCategory = this.matter.world.nextCategory();

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

        // Referenced Code
        const canCollide = (filterA, filterB) =>
        {
            if (filterA.group === filterB.group && filterA.group !== 0)
            { return filterA.group > 0; }

            return (filterA.mask & filterB.category) !== 0 && (filterB.mask & filterA.category) !== 0;
        };
        // end of ref code

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

        this.input.once('pointerup', function (pointer)
        {

            this.time.addEvent({
                delay: 1000,
                callback: function ()
                {
                    const ball = this.matter.add.image(Phaser.Math.Between(100, w-100), Phaser.Math.Between(-h, 0), 'restart');
                    ball.setCircle();
                    ball.setCollisionCategory(ballsCategory);
                    // ball.setCollidesWith(starsCategory, lineCategory);
                    ball.setFriction(0.005).setBounce(0.1);
                    ball.setScale(0.3);
                },
                callbackScope: this,
                repeat: 100
            });

        }, this);

        let star = this.matter.add.image(800, 600, 'star').setStatic(true).setScale(0.1);
        star.setCollisionCategory(starsCategory);
        star.setOnCollide(this.handleStarCollision);

    }

    handleStarCollision(data) {
        const {bodyA, bodyB} = data;   
        const goA = bodyA.gameObject; 
        goA.destroy(true);
        //console.log(data);
    }
}