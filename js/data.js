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
        "content": `<p>At the start screen select your players character and press the PLAY button</p>
                    <p>When the game starts you can use your keyboards arrows to move the player across the field</p>
                    <p>The player starts with three lifes and loses one each time that get hit by an enemy</p>
                    <p>At random times extra life and gems will appear in the game, each with different bonus for the player</p>
                    <p>The goal of the game is to reach to the top without getting hit as many times possible and ends when there are no lives left for the player</p>`,
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
        "power": `PLAYER.lives += 1`
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