/* Written by Samuel Orchard, from 3rd July 2024
this is the main script for the game, it contains all the code for the game initialisation for the player and enemies, as well as the game loop
displays the the main and sub menus and allows for relaying.
*/
let started = false;
let dead = false;
let controls = false;
let enemies = [];
let effects = [];
let bullets = [];
let releaseMouse = false; //tracks if the mouse has been released 
let agEnSpeed = Math.round(Math.random(0, 1) * 10);
let enemyTypes = Math.round(Math.random(0,10) * 10);

function setup() {
  createCanvas(windowWidth - 25, windowHeight - 25); // create a canvas to draw the level on, changes dependin on the window size
  player = new Player(); //initiaties a new player object
  platform = new platforms();
  bullets = [];
  for (let i = 0; i < ((1 + Math.round(Math.random() * 10))) * (width / 1400); i++) {  //spawns a random number of enemies depending on the size of the window
    let agEnSpeed = Math.round(Math.random(1, 2) * 10); //randomly sets the speed of the aggressive enemies
    let enemyTypes = Math.round(Math.random(0,10) * 10); //randomly sets the number of aggressive enemies vs normal enemies
    while (agEnSpeed >= 3) {  //prevents the agressive enemy being faster than the player
      agEnSpeed -= 1;
    }
    if (enemyTypes > 5){ //adds new enemies
      enemies.push(new Enemy());
    } else { //adds new aggressive enemies 
      enemies.push(new aggroEnemy(agEnSpeed));
    }
  }
}


function draw() {
  if(!started && !controls) { //game not started and controls not displayed
    textSize(32);
    background(100,100,100);
    rectMode(CORNER);  
    //display click to start button
    if(mouseX > width/2 - 125 && mouseX < width/2 + 125 && mouseY > height/2 - 35 && mouseY < height/2 + 15){ //checks if the mouse is over the button
      textAlign(CENTER); //if the mouse is hovering over the button the colours invert
      fill("white")
      rect(width/2 - 125, height/2 - 35, 250, 50, 20);
      fill("black")
      text("click to start", width/2, height/2);
      if(mouseIsPressed && releaseMouse){ //checks if the user has clicked the button
        started = true;
      }
    }else{ //if the mouse is over the button draws the button normally 
      textAlign(CENTER);
      fill("black")
      rect(width/2 - 125, height/2 - 35, 250, 50, 20);
      fill("white")
      text("click to start", width/2, height/2);
    }
    //display controls button
    if(mouseX > width/2 - 125 && mouseX < width/2 + 125 && mouseY > height/2 + 80 && mouseY < height/2 + 110){ //checks if the mouse is over the button
      textAlign(CENTER); //if the mouse is hovering over the button the colours invert
      fill("white")
      rect(width/2 - 125, height/2 + 80, 250, 50, 20);
      fill("black")
      text("controls", width/2, height/2 + 115);
      if(mouseIsPressed && releaseMouse){ //checks if the user has clicked the button
        controls = true;
        releaseMouse = false; //resets the mouse release variable when moving to the controls
      }
    }else{ //if the mouse is over the button draws the button normally 
      textAlign(CENTER);
      fill("black")
      rect(width/2 - 125, height/2 + 80, 250, 50, 20);
      fill("white")
      text("controls", width/2, height/2 + 115);
    }

    if (!mouseIsPressed) {
      releaseMouse = true; //resets the mouse release variabel when the mouse is released
    }

    return; // Exit the draw function to prevent further drawing
  }

  if (controls) {
    textSize(32);
    background(100, 100, 100);
    rectMode(CORNER);
  
    // Back button to return to the start screen
    if (mouseX > width / 2 - 125 && mouseX < width / 2 + 125 && mouseY > height / 2 - 40 && mouseY < height / 2 + 15) { //checks if the mouse is over the button
      textAlign(CENTER); // If the mouse is hovering over the button, the colors invert
      fill("white");
      rect(width / 2 - 125, height / 2 - 40, 250, 50, 20);
      fill("black");
      text("Back", width / 2, height / 2);
      if (mouseIsPressed && releaseMouse) { // Checks if the user has clicked the button
        controls = false; // Go back to the start screen
        releaseMouse = false; //prevents the game immediately starting when back is clicked
      }
    } else { // If the mouse is not hovering over the button, draw the button normally
      textAlign(CENTER);
      fill("black");
      rect(width / 2 - 125, height / 2 - 40, 250, 50, 20);
      fill("white");
      text("Back", width / 2, height / 2 - 5);
    }
  
    // Display the controls list
    textAlign(CENTER);
    fill(12, 0, 99);
    rect(width / 2 - 125, height / 2 + 35, 250, 360, 20);
    fill("white");
    text("A = Move Left", width / 2, height / 2 + 75);
    text("D = Move Right", width / 2, height / 2 + 135);
    text("W = Jump", width / 2, height / 2 + 200);
    text("S = Slow Fall", width / 2, height / 2 + 255);
    text("Shift = Dash", width / 2, height / 2 + 315);
    text("LMB = Attack", width / 2, height / 2 + 375);
    if (!mouseIsPressed) {
      releaseMouse = true; //resets the mouse release variabel when the mouse is released
    }

    return; // Exit draw function to prevent further drawing
  }
  

  //if game has started
  if (started && !dead){
    if(player.health <= 0){
      player.health = 100;
      setup(); //resets the game
      dead = true;
    }

    if(enemies.length == 0){ //takes you back to the main menu when all enemies are dead 
      started = false
    }

    if (mouseIsPressed && releaseMouse) { //shoots when the player clicks 
      player.shoot();
      releaseMouse = false //prevents multiple bullets spawning from one click
    }

    if(!mouseIsPressed){ //resets the releaseMouse variable when the mouse is released
      releaseMouse = true;
    }
  
    background(100, 100, 100); // set the background to grey
    rectMode(CENTER);
    playerHandle();
    enemyHandle();
    handleEffects();
    handleBullets();
  }

  if (dead){
    textSize(32);
    background(100,100,100);
    rectMode(CORNER);
    //making a button to restart the game 
    if(mouseX > width/2 - 125 && mouseX < width/2 + 125 && mouseY > height/2 - 35 && mouseY < height/2 + 15){ //checks if the mouse is over the button
      textAlign(CENTER); //if the mouse is hovering over the button the colours invert
      fill("white")
      rect(width/2 - 125, height/2 - 35, 250, 50, 20);
      fill("black")
      text("click to respawn", width/2, height/2);
      if(mouseIsPressed){ //checks if the user has clicked the button
        dead = false;
      }
    }else{ //if the mouse is over the button draws the button normally 
      textAlign(CENTER);
      fill("black")
      rect(width/2 - 125, height/2 - 35, 250, 50, 20);
      fill("white")
      text("click to respawn", width/2, height/2);
    }
    return; // Exit the draw function to prevent further drawing
  }
}

function playerHandle() {
  player.draw(); //draws the player
  player.applyGravity();//applies gravity to the player
  player.move();// allows the player to move
  player.enemyAttacks(); //checks for enemy attacks
  player.invincibilityDuration--
  platform.display();
}

function enemyHandle(){
  for(let i in enemies) {
    enemies[i].draw(); //draws the enemies
    enemies[i].applyGravity(); //applies gravity to the enemies
    enemies[i].move(); //allows the enemies to move
    enemies[i].getHit(); //allows the enemy to be damaged
    if(enemies[i].health <= 0){
      enemies.splice(i,1);
    }
  }
}

function handleEffects() {
  for (let i in effects) { //runs the effect for invincibility frames
    effects[i].update();
    effects[i].display(); //shows the invincibility frame effect SD
    if (effects[i].duration < 0) {
      effects.splice(i, 1);
      i--;
    }
  }
}

function handleBullets() {
  for (let i in bullets) { 
    bullets[i].update(); //moves the bullet 
    bullets[i].display(); //displays the bullets 
    if (!bullets[i].checkOnScreen()) { //checks that the bullets are off the screen 
      bullets.splice(i, 1); //if the bullets are off the screen they are removed 
      i--;
    }
  }
}