/*
Author: Penny Vizenor  
Purpose: App engine for playing game
*/

var random = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};


var imgData = [],

     heart = '<img src = "images/Heart.png">',

       enemybug = 'images/enemy-bug-1.png',

  allEnemies=[],

    item,

    
    player;



imgData.push('images/Gem_Blue.png');
imgData.push('images/Gem_Green.png');
imgData.push('images/Gem_Orange.png');


var Enemy = function () {

    
    this.type = random(1, 6);

    
    this.sprite = enemybug;

    
    this.x = this.type * -101;

    
    this.y = random(0, 4) * 83 + 62;

    
    this.speed = this.type * 100;
};


Enemy.prototype.update = function(dt) {

    
    var AElength = allEnemies.length
        index = 0;

        this.x += this.speed * dt;

    
    for (; index < AElength; index++) {

        
        if (allEnemies[index].x > 808) {
          allEnemies.splice(index, 1, new Enemy());
        }
    }

    
    if (AElength < 4 + Math.floor(player.level / 5)) {
        allEnemies.push(new Enemy());
    } else if (AElength > 4 + Math.floor(player.level / 5)) {
        allEnemies.pop();
    }
};


Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
Method: Item() Object
Input: none
Output: none/void
Description: Lifes/Items that player can collect while playing the game 
             creating an item object.
*/
var Item = function() {

   
    this.type = random(1, 4);

    
    this.sprite = imgData[(this.type)-1];

     
    this.x = random(0, 8) * 101;
    this.y = random(0, 4) * 83 + 55;
};

/*
Method: Item.Render()
Input: none
Output: none/void
Description: Draws/Rendering of the Item on the stage.
*/
Item.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
Method: Player() Object
Input: player icon/image
Output: none/void
Description: The player starts at a random location on the bottom row as a 
             male unless the game was restarted and a female was selected.
*/
var Player = function (type) {

    
    this.type = type;

    
    this.sprite = 'images/char-' + this.type + '.png';

    
    this.x = random(0, 8) * 101;
    this.y = 402;

    
    this.exit = random(0, 8);

    //Game default; player to 1, score to 0, Number of Lives to 3 and Run the game
    this.level = 1;
    this.score = 0;
    this.lives = [heart, heart, heart];
    this.paused = false;
};

/*
Method: Player.update(dt)
Input: none
Output: none/void
Description: Operates on an instance of Player and checks for collisions with objects.
*/
Player.prototype.update = function() {

    var iAElength = allEnemies.length,
        iCounter = 0;

    //Loop through Enemy bugs and check if they are Collisioning with the Plyaer 
    for (; iCounter < iAElength; iCounter++) {

        //Reset appropriate values if the collison happens
        if (Math.abs(allEnemies[iCounter].x - this.x) < 50 &&
          Math.abs(allEnemies[iCounter].y - this.y) < 66) {

                     //Remove a life/Heart from the stage
            this.lives.pop();

            //Reset Player
            this.reset();
        }
    }

    //Check if the items on the stage are collisioning with the player
    if (Math.abs(item.x - this.x) < 50 && Math.abs(item.y - this.y) < 66) {

        //Add a Life/Heart and update score as soon as player grabs the gem 
        if (item.type === 4) {

            //Sound appropriate sound
            sounds[3].play();

            //Add new life/heart
            this.lives.push(heart);
        } else {

            //Update Score
            sounds[2].play();
            this.score += item.type * 100;
        }

        //Remove the Gem/Item off from the stage
        item.x = -101;

    } else if (this.y < 45) {
      
        //Check if the Player successfully touched the exit door
        if (Math.abs((this.exit * 101) - this.x) < 50) {

            //Player success sound, Move user to the next Level and reset player
            sounds[4].play();
            this.level++;
            item = new Item();
        } else {

            //User didn't touch the exit door
            sounds[5].play();

            //Remove a life/heart from the stage
            this.lives.pop();
        }

        //Reset Player
        this.reset();
    }
};

/*
Method: Player.render(dt)
Input: none
Output: none/void
Description: Render screen with appropriate sprite
*/
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
Method: Player.handleInput(keycode)
Input: input from Key-board onKeyPress
Output: none/void
Description: Operates on an instance of Player and moves the player
*/
Player.prototype.handleInput = function (keycode) {
  
    //Manage directional keys along with P;
    if (keycode === 'up' && this.y > 44 && !this.paused) {
        this.y -= 83;
    } else if (keycode === 'down' && this.y < 377 && !this.paused) {
        this.y += 83;
    } else if (keycode === 'left' && this.x > 83 && !this.paused) {
        this.x -= 101;
    } else if (keycode === 'right' && this.x < 707 && !this.paused) {
        this.x += 101;
    } else if (keycode === 'p') {
      
        //Change player ICON
        if (this.type === 5) {
            this.type = 1;
        }else {
            this.type ++;
        }

        this.sprite = 'images/char-' + this.type + '.png';
    } else if (keycode === 'q') {

       //Pause the game and show quit or resume
       //Display confirm box and capture user input
        var quit = confirm('Press OK to quit or CANCEL to resume.');

        //Pause the game, during the confirm status
        this.paused = true;

        if (quit) {

            //If user choose to Quit the game, close the browser window
            window.close();
        }else {

            //User doesn't want to quit, resume the page
            this.paused = false;
        }

    } else if (keycode === 'space') {

        //Pause and Play the game during space-bar handling
        if (this.paused) {
            this.paused = false;
        } else {
            this.paused = true;
        }
    }
};

/*
Method: Player.reset()
Input: none
Output: none/void
Description: Reset player position after finishing the game.
*/
Player.prototype.reset = function () {

    //Confirm Game over and let user choose to restart
    if (this.lives.length === 0) {

        //Play end of the game sound and update lives
        sounds[6].play();
        document.getElementsByClassName('lives')[0].innerHTML = 'Lives:  ' + this.lives;

        //Display Gameover confirm box to either re-start game or close the window
        var gameOver = confirm('Game Over!  Press OK to play again or CANCEL to quit.');

        if (gameOver) {

            //Initiate player
            player = new Player(this.type);
        } else {

            //close browser window
            window.close();
        }
    }


    //reset player positions
    this.x = random(0, 8) * 101;
    this.y = 402;
    ctx.clearRect(this.exit * 101, 0, 101, 171);
    this.exit = random(0, 8);
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      32: 'space',
      80: 'p',
      81: 'q'
  };
  
  player.handleInput(allowedKeys[e.keyCode]);
});

//Display enemy images for each row
allEnemies = [
              new Enemy(), 
              new Enemy(), 
              new Enemy(), 
              new Enemy()
             ];

//Instantiate item
item = new Item();

//Instantiate the player.
player = new Player(1);
