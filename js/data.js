var modal_data = {
    "empty": {
        "title": "Title goes here",
        "content": "Content goes here",
        "buttons": ["modal_close"]
    },
    "credits": {
        "title": "Credits",
        "content": `<p>made with <span style="color: #b22222">❤</span> by john mantas</p>
                    <p>Project from Udacity Fend Nanodegree</p>
                    <p>2018 @ Athens, Greece</p>`,
        "buttons": ["modal_close"]
    },
    "howToPlay": {
        "title": "How to play",
        "content": `<p>The goal is to reach the water and collect points,
                        use the arrow keys to navigate to the top</p>
                    <p>When you are on the grass you are safe</p>
                    <p>Avoid the bugs, they will eat your life <br> you only start with 3</p>
                    <p>To play select your character and press enter or the start button</p>`,
        "buttons": ["modal_close"]
    },
    "died": {
        "title": "You died!",
        "content": `<p>You scored <span id="final_score"></span> points</p>`,
        "buttons": ["modal_menu","modal_play"]
    }
};

var powerUp_data = {
    "life": {
        "sprite": "images/heart-small.png",
        "power": `player.lifes += 1`
    },
    "gemBlue": {
        "sprite": "images/gem-blue.png",
        "power": `totalScore += 60`
    },
    "gemGreen": {
        "sprite": "images/gem-green.png",
        "power": `totalScore += 40`
    },
    "gemOrange": {
        "sprite": "images/gem-orange.png",
        "power": `totalScore += 20`
    }
};