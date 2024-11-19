/* 
Written by Samuel Orchard, on the 3rd - 5th July 2024
this code is for the player object, it contains all the code for the player initialisation, movement, health and damage and collision detection with the floor and walls
*/
class Player {
  constructor() { //initiates all the variables for the player class
    this.pos = createVector((width-1)*Math.random()+1, (height-1)*Math.random()+1); //the position vector of the player
    this.vel = createVector(0, 0); //the velocity vector of the player
    this.accel = createVector(0, 0); //the acclleration vector of the player 
    this.health = 100; //the health of the player
    this.falling = true; 
    this.canJump = true;
    this.justJumped = false;
    this.justDashed = false;
    this.pos.x = constrain(this.pos.x, 10, width - 10); //restricts the position of the player to on the screen 
    this.pos.y = constrain(this.pos.y, 10, height - 10);
    this.dashCooldown = 60; //cooldown timer for the dash
    this.dashTimeRemaining = 0; //Timer for dash ability
    this.dashTimeRemaining = constrain(this.dashTimeRemaining, 0, 90); //constrains the dash timer between 0 and 90
    this.hitboxRadius = 10
    this.invincibilityDuration = 0;
  }

  draw() { //draws the player
    fill("white")
    rect(this.pos.x, this.pos.y, 20, 20);
    rectMode(CORNER)
    fill("black")
    rect(this.pos.x - 25, this.pos.y + 15, 50, 5)
    fill("red")
    rect(this.pos.x - 25, this.pos.y + 15, this.health/2, 5)
    textSize(15)
    textAlign(CENTER);
    rectMode(CENTER)
    fill("black");
    rect(70, 15, this.dashCooldown*2, 10); //visual indicator of the dash cooldown
    fill("white");
    textFont('Comic Sans');
    text("dash", 70, 35);
    rect(70, 15, this.dashCooldown*2 - this.dashTimeRemaining*2, 10); //adds a visual indicator of the dash cooldown
    if (!this.justDashed){ //adds a black cube to the corner of the player to indicate if they can dash
      fill("black")
      rect(this.pos.x - 5, this.pos.y + 5, 2,2);
    }
    if (this.justDashed = true){  //cooldown for the dash
      this.dashTimeRemaining--
      if (this.dashTimeRemaining <= 0){
        this.justDashed = false
        this.dashTimeRemaining = 0
      } 
    }
  }

  enemyAttacks(){ //checks if touching enemy and gets hurt if so
    if(this.invincibilityDuration <= 0){
      for (let enemy of enemies){
        if (Math.sqrt(Math.pow(this.pos.x - enemy.pos.x, 2) + Math.pow(this.pos.y - enemy.pos.y, 2)) < (this.hitboxRadius + enemy.hitboxRadius)){
          this.hurt(5);
          console.log("damage")
        }
      }
    }
  }

  jump() { //lets the player jump
    if (!this.falling) { 
      this.canJump = true;
      this.pos.y--;
      this.vel.y = -20;
      this.falling = true; 
    }else if(this.canJump && this.falling){ //lets the player jump whilst in the air
      this.pos.y--;
      this.vel.y = -20;
      this.falling = true;
      this.canJump = false;
    }
  }

  dash() { //lets the player dash
    if (!this.justDashed){
      this.vel.x *= 20 //multiplies the velocity by 20 to dash
      this.justDashed = true;
      this.dashTimeRemaining = this.dashCooldown;
    }
  }

  stopFalling() { //stops the player from falling through the floor
    this.falling = false;
    this.accel.y = 0;
    this.vel.y = 0;
    this.pos.y = height
    this.canJump = true;
  }
  applyGravity() { //applies gravity to the player 
    if (this.falling && this.pos.y >= height) {
      this.stopFalling();
    }

    if (this.falling) { //accelerates the player under gravity 
      this.accel.y = 1;
    }
  }

  hurt(dmg) { //deals damage
    this.health -= dmg;
    this.invincibilityDuration = 30;
    effects.push(new Effect(0,0,10));
    effects[effects.length-1].display = function(){
      fill(255,0,0,(this.duration)*9);
      rectMode(CORNER)
      rect(this.pos.x,this.pos.y,width,height);
    }
  }

  move() { //allows the player to move using the WASD keys and the spacebar

    /* 
    These keycodes represent the following keys:
    W = 87
    A = 65
    S = 83
    D = 68
    shift = 16
    Spacebar = 32
    */
    
    if (keyIsDown(65)) {
      this.vel.x = -4; //player has a velocity left 
    }
    if (keyIsDown(68)) {
      this.vel.x = 4; //player has a velocity right
    }
    if (keyIsDown(16) && !this.justDashed) { //16 is the key code for left shift 
      this.dash()
      console.log("dash")
    }

    if ((keyIsDown(87) || keyIsDown(32))) { //if the spacebar or W key are pressed jumps
      if (!this.justJumped) { //jumps if the player hasn't just jumped
        this.jump();
        this.justJumped = true;
      }
    } else {
      this.justJumped = false;

    }

    if (keyIsDown(83)) { //slow falls if the S key is pressed 
      this.vel.y = 1;
    }

    if (!keyIsDown(65) && !keyIsDown(68)) { //if the A and D keys are pressed at the same time the player doesn't move
      this.vel.x = 0;
    }

    if (this.pos.x > width - 20){ //stops the player from going off the screen
      this.pos.x = width - 20;
    }
    if (this.pos.x < 20){
      this.pos.x = 20;
    }

    this.vel.add(this.accel); //accelerates the player
    this.pos.add(this.vel); //moves the player

    if (this.pos.y > height - 20) { //resets the jumping when the player hits the floor 
      this.stopFalling();
      this.pos.y = height - 20;
      this.jumpCount = 0;
    }else{ //applies gravity if the player is above the ground
      this.applyGravity(); 
    }
  }

  shoot(){
    let bulletAngle = atan2((mouseX-this.pos.x),(mouseY-this.pos.y)) 
    bullets.push(new Bullet(this.pos.x, this.pos.y, bulletAngle));
    this.ammo--;
  }
}