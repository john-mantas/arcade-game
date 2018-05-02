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
        console.log('collision');
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player {
    constructor(x,y) {
        this.sprite = 'images/char-boy.png';
        this.x = x;
        this.y = y;
    }

    update() {
        if (this.y === 0) {
            setTimeout(function() {
                player.resetToStart()
            }, 300);
            console.log('win');
        }
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(keyPressed) {
        switch (keyPressed) {
            case 'left':
                if (this.x >= 101) {
                    this.x -= 101;
                    console.log('left');
                }
                break;
            case 'up':
                if (this.y >= 83) {
                    this.y -= 83;
                    console.log('up');
                }
                break;
            case 'right':
                if (this.x <= 303) {
                    this.x += 101;
                    console.log('right');
                }
                break;
            case 'down':
                if (this.y <= 332) {
                    this.y += 83;
                    console.log('down');
                }
                break;
        }
    }

    resetToStart() {
        this.x = 202;
        this.y = 332;
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const enemyTop = new Enemy(-101, 83 , getRandom(100,300));
const enemyMiddle = new Enemy(-101, 166, getRandom(100,300));
const enemyBottom = new Enemy(-101, 249, getRandom(100,300));

let allEnemies = [enemyTop, enemyMiddle, enemyBottom];

const player = new Player(202, 332);

//Randomize function from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
