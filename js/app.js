//Home screen
const charCont = document.getElementById('character');
const arrowLeft = document.getElementById('arrow_left');
const arrowRight = document.getElementById('arrow_right');
const playerCharacters = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
];

let charIndex = 0;

arrowLeft.addEventListener('click', function() {
    if (charIndex === 0) {
        charIndex = playerCharacters.length;
    }
    charIndex--
    charCont.setAttribute('src', playerCharacters[charIndex]);
});

arrowRight.addEventListener('click', function() {
    if (charIndex === playerCharacters.length-1) {
        charIndex = -1;
    }
    charIndex++
    charCont.setAttribute('src', playerCharacters[charIndex]);
});

//Home screen - Play button
document.getElementById('home_play').addEventListener('click', function() {
    player.sprite = charCont.getAttribute('src');
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

function setModalData(cd='empty') {
    console.log(cd);
    modalTitle.innerHTML = modal_data[cd].title;
    modalContent.innerHTML = modal_data[cd].content;

    for (let btn of modalButtons) {
        btn.style.display = 'none';
        for (let activeBtn of modal_data[cd].buttons) {
            if (btn.id === activeBtn) {
                console.log(activeBtn);
                btn.style.display = 'inline-block';
            }
        }
    }
}

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

// Game sounds
let jumpSound = new Audio('sounds/jump.wav');
let winSound = new Audio('sounds/win.wav');
let collisionSound = new Audio('sounds/collision.wav');

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;

    if (this.x > 505) {
        this.x = -101;
    }

    if (((parseInt(this.x + 70) > player.x && parseInt(this.x) < player.x) ||
         (parseInt(this.x + 70) > player.x + 70 && parseInt(this.x) < player.x + 70)) &&
        this.y === player.y) {
        player.resetToStart();
        collisionSound.play();
        console.log('collision');
        player.lifes--;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
let totalScore = 0;

class Player {
    constructor(x,y) {
        this.sprite = 'images/char-boy.png';
        this.x = x;
        this.y = y;
        this.lifes;
    }

    update() {
        if (this.y === -20) {
            winSound.play();
            player.resetToStart()
            console.log('win');
            totalScore += 100;
        }

        if (this.lifes === 0) {
            console.log('dead');
            stop = true;
            setModalData('died');
            document.getElementById('final_score').innerHTML = totalScore;
            modal.classList.add('is-open');
        }
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

        for (let i=0; i<=this.lifes-1; i++) {
            ctx.drawImage(Resources.get('images/heart-small.png'), (i*32), 0, 35, 60);
        };
    }

    handleInput(keyPressed) {
        switch (keyPressed) {
            case 'left':
                if (this.x >= 101) {
                    this.x -= 101;
                    jumpSound.play();
                    console.log('left');
                }
                break;
            case 'up':
                if (this.y >= 63) {
                    this.y -= 83;
                    jumpSound.play();
                    console.log('up');
                }
                break;
            case 'right':
                if (this.x <= 303) {
                    this.x += 101;
                    jumpSound.play();
                    console.log('right');
                }
                break;
            case 'down':
                if (this.y <= 312) {
                    this.y += 83;
                    jumpSound.play();
                    console.log('down');
                }
                break;
        }
    }

    resetToStart() {
        this.x = 202;
        this.y = 312;
    }
}

//Power-ups
class powerUp {
    constructor(obj) {
        this.item = obj;
        this.sprite = this.item.sprite;
        this.x = getRandom(0,4)*101;
        this.y = getRandom(1,3)*83;
        this.storeIt = false;
    }

    render() {
        if (this.storeIt){
            ctx.drawImage(Resources.get(this.sprite),this.x,this.y, 35,65);
        } else {
            ctx.drawImage(Resources.get(this.sprite),this.x,this.y);
        }
    }

    update() {
        if (this.x === player.x && this.y === player.y+20) {
            this.addPower();
            this.x = 0;
            this.y = 532;
            this.storeIt = true;
        }
    }

    addPower() {
        eval(this.item.power);
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const enemyTop = new Enemy(-101, 63 , getRandom(100,300));
const enemyMiddle = new Enemy(-101, 146, getRandom(100,300));
const enemyBottom = new Enemy(-101, 229, getRandom(100,300));

let allEnemies = [enemyTop, enemyMiddle, enemyBottom];

const player = new Player(202, 312);

let allPowerUps = [];
let setPu = new Set();
setPu.add(new powerUp(powerUp_data.gemBlue));
setPu.add(new powerUp(powerUp_data.gemGreen));
setPu.add(new powerUp(powerUp_data.gemOrange));
setPu.add(new powerUp(powerUp_data.life));

function* pushPowerUps(p) {
    setTimeout(function() {
        allPowerUps.push(p);
    },getRandom(10000,20000));
    yield;
}

for (let power of setPu) {
    pushPowerUps(power).next();
    console.log(power);
}

//Randomize function from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    if (!stop) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        player.handleInput(allowedKeys[e.keyCode]);
    }
});