let totalScore = 0;

//Home screen character selection
const CHAR_CONT = document.getElementById('character');
const ARROW_LEFT = document.getElementById('arrow_left');
const ARROW_RIGHT = document.getElementById('arrow_right');
const PLAYER_CHARACTERS = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
];

let charIndex = 0;

ARROW_LEFT.addEventListener('click', function() {
    if (charIndex === 0) {
        charIndex = PLAYER_CHARACTERS.length;
    }
    charIndex--
    CHAR_CONT.setAttribute('src', PLAYER_CHARACTERS[charIndex]);
});

ARROW_RIGHT.addEventListener('click', function() {
    if (charIndex === PLAYER_CHARACTERS.length-1) {
        charIndex = -1;
    }
    charIndex++
    CHAR_CONT.setAttribute('src', PLAYER_CHARACTERS[charIndex]);
});

//Home screen - Play button
document.getElementById('home_play').addEventListener('click', function() {
    PLAYER.sprite = CHAR_CONT.getAttribute('src');
    document.getElementById('home_screen').classList.add('is-hidden');
    Engine(global);
});

//Modals
let modal = document.getElementById('modal');
let modalTitle = document.getElementById('modal_title');
let modalContent = document.getElementById('modal_content');
let modalMenu = document.getElementById('modal_menu');
let modalPlay = document.getElementById('modal_play');
let modalClose = document.getElementById('modal_close');
let modalButtons = [modalMenu, modalPlay, modalClose];

/**
* @description Set each time the corresponding data for the modals
* @param {string} cd - case data, which case should load
*/
function setModalData(cd='empty') {
    modalTitle.innerHTML = modal_data[cd].title;
    modalContent.innerHTML = modal_data[cd].content;

    for (let btn of modalButtons) {
        btn.style.display = 'none';
        for (let activeBtn of modal_data[cd].buttons) {
            if (btn.id === activeBtn) {
                btn.style.display = 'inline-block';
            }
        }
    }
}

modalClose.addEventListener('click', () => {
    modal.classList.remove('is-open');
    modalTitle.innerHTML = '';
    modalContent.innerHTML = ''; 
});

modalMenu.addEventListener('click', () => {
    window.location.reload();
});

modalPlay.addEventListener('click', () => {
    modal.classList.remove('is-open');
    document.querySelector('canvas').remove();
    Engine(global);
    init();
});

let footerCredits = document.getElementById('footer_credits');
footerCredits.addEventListener('click', function() {
    setModalData('credits');
    modal.classList.add('is-open');
});

let footerHowto = document.getElementById('footer_howto');
footerHowto.addEventListener('click', function() {
    setModalData('howToPlay');
    modal.classList.add('is-open');
});

// Game sounds used inside the game
let jumpSound = new Audio('sounds/jump.wav');
let winSound = new Audio('sounds/win.wav');
let collisionSound = new Audio('sounds/collision.wav');

/**
* @description The enemies of the game
* @constructor
* @param {number} x - The x coordinate of the enemy
* @param {number} y - The y coordinate of the enemy
* @param {number} speed - The speed that our enemy will run
*/
var Enemy = function(x, y, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

//Set the speed of the enemies, make them cross the screen and check for collisions with the player
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed * dt;

    if (this.x > 505) {
        this.x = -101;
        this.speed = getRandom(100, 300);
    }

    if (((parseInt(this.x + 70) > PLAYER.x && parseInt(this.x) < PLAYER.x) ||
         (parseInt(this.x + 70) > PLAYER.x + 70 && parseInt(this.x) < PLAYER.x + 70)) &&
        this.y === PLAYER.y) {
        PLAYER.resetToStart();
        collisionSound.play();
        PLAYER.lives--;
    }
};

//Render the enemies on the canvas
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description Our player for the game
* @class
* @param {number} x - The x coordinate of the player
* @param {number} y - The y coordinate of the player
*/
class Player {
    constructor(x,y) {
        this.sprite = 'images/char-boy.png';
        this.x = x;
        this.y = y;
        this.lives;
    }

    //Check if the player reached the goal and if is still alive
    update() {
        if (this.y === -20) {
            winSound.play();
            this.resetToStart()
            totalScore += 100;
        }

        if (this.lives === 0) {
            stop = true;
            setModalData('died');
            document.getElementById('final_score').innerHTML = totalScore;
            modal.classList.add('is-open');
        }
    }

    //Render the player and how many lives left on the canvas
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

        for (let i=0; i<=this.lives-1; i++) {
            ctx.drawImage(Resources.get('images/heart-small.png'), (i*32), 0, 35, 60);
        };
    }

    //Provide the controls for the game
    handleInput(keyPressed) {
        switch (keyPressed) {
            case 'left':
                if (this.x >= 101) {
                    this.x -= 101;
                    jumpSound.play();
                }
                break;
            case 'up':
                if (this.y >= 63) {
                    this.y -= 83;
                    jumpSound.play();
                }
                break;
            case 'right':
                if (this.x <= 303) {
                    this.x += 101;
                    jumpSound.play();
                }
                break;
            case 'down':
                if (this.y <= 312) {
                    this.y += 83;
                    jumpSound.play();
                }
                break;
        }
    }

    //Take player to it's initial location
    resetToStart() {
        this.x = 202;
        this.y = 312;
    }
}

/**
* @description Power ups used in the game
* @class
* @param {object} obj - The object that loads the values
*/
class PowerUp {
    constructor(obj) {
        this.item = obj;
        this.sprite = this.item.sprite;
        this.x = getRandom(0, 4) * 101;
        this.y = getRandom(1, 3) * 83;
        this.storeIt = false;
    }

    //Render the power-ups on the canvas
    render() {
        if (this.storeIt){
            ctx.drawImage(Resources.get(this.sprite),this.x,this.y, 35, 65);
        } else {
            ctx.drawImage(Resources.get(this.sprite),this.x,this.y);
        }
    }

    //Check if the player has hit a power-up
    update() {
        if (this.x === PLAYER.x && this.y === PLAYER.y + 20) {
            this.addPower();
            this.x = 0;
            this.y = 532;
            this.storeIt = true;
        }
    }

    //Add the power to the player
    addPower() {
        eval(this.item.power);
    }
}

//Instantianting enemies, player and power-ups
const ENEMY_TOP = new Enemy(-101, 63, getRandom(100, 300));
const ENEMY_MIDDLE = new Enemy(-101, 146, getRandom(100, 300));
const ENEMY_BOTTOM = new Enemy(-101, 229, getRandom(100, 300));

let allEnemies = [ENEMY_TOP, ENEMY_MIDDLE, ENEMY_BOTTOM];

const PLAYER = new Player(202, 312);

let allPowerUps = [];
let setPu = new Set();
setPu.add(new PowerUp(powerUp_data.gemBlue));
setPu.add(new PowerUp(powerUp_data.gemGreen));
setPu.add(new PowerUp(powerUp_data.gemOrange));
setPu.add(new PowerUp(powerUp_data.life));

function playPowerUps() {
    /**
* @description Push the power-ups with delay to an array for rendering
* @generator
* @function pushPowerUps
* @param {p} - Each item to push to the array
*/
    function* pushPowerUps(p) {
        setTimeout(function() {
            allPowerUps.push(p);
        },getRandom(10000, 20000));
        yield;
    }

    //Add all power-ups to the array for rendering
    for (let power of setPu) {
        pushPowerUps(power).next();
    }
}

//Randomize function from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//This listens for key presses and sends the keys to Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    if (!stop) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        PLAYER.handleInput(allowedKeys[e.keyCode]);
    }
});