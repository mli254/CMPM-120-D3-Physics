# CMPM-120-D3-Physics
Repository for Demo 3 for CMPM 120: Physics-based Game.
Play the game at [this link](https://mli254.github.io/CMPM-120-D3-Physics/).

### Gameplay/Experience Requirements
- **The game uses both continuous and discrete inputs from the player**
    - Continuous:
        - Drawing lines to control the movement of the ball
    - Discrete: 
        - Pressing the "play" button to cause the ball to drop
        - Pressing the "restart" button to restart the level
- **The player’s goal can only be achieved indirectly (by allowing the physics engine to move key objects into position/contact).**
    - The player can't move the ball directly towards the stars, and must draw lines in order to influence its movement.
- **3+ physics-based gameplay scenes (possibly implemented with a single Phaser Scene subclass).**
    - Level 1: one ball, one star
    - Level 2: one ball, two stars
    - Level 3: one ball, three stars
- **Other scenes are used to separate and contextualize the gameplay scenes**
    - 3 summary pages

### Assets
- The title screen, logo, moon asset, and backgrounds were created by me in Clip Studio Paint
- The star icon was created and downloaded from [this user](https://assets.clip-studio.com/ja-jp/detail?id=1611768) on the Clip Studio Asset Store
    - I changed the tint of the star through Phaser's built-in functions
- The reload icon was created by [Luke Peek](https://thenounproject.com/icon/arrow-restart-743886/)
    - The asset's color was then changed to white by me via CSP
- The curly arrow asset was created by [Muhammad Ridho](https://www.flaticon.com/free-icon/curved-arrow_4274640)
    - The asset's color was then changed to white by me via CSP
- The play button asset can be sourced from [here](https://www.flaticon.com/free-icon/play-button_375)
    - The asset's color was then changed to white by me via CSP
- The font, "Indie Flower", was downloaded from Google and used in varying font-sizes throughout the game