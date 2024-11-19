/*
Written by Samuel Orchard, on the 5th July 2024
This code is for the aggroEnemy object, it contains all the code for the aggroEnemy initialisation, movement, health and damage and collision with the floor and walls
*/
class aggroEnemy{
  constructor(pSpeed){ //initiates all the variables for the aggressive enemy class including position, velocity, acceleration and health 
    this.pos = createVector((width-1)*Math.random()+1, (height-1)*Math.random()+1);
    this.vel = createVector(0, 0);
    this.accel = createVector(0, 0);
    this.health = 100;
    this.falling = true;
    this.speed = pSpeed;
    this.hitboxRadius = 12.5
    this.jumpNum = 0
  }

  draw(){ //draws the enemy
    fill("blue")
    rect(this.pos.x, this.pos.y, 25, 25)
    rectMode(CORNER)
    fill("black")
    rect(this.pos.x - 25, this.pos.y + 15, 50, 5)
    fill("red")
    rect(this.pos.x - 25, this.pos.y + 15, this.health/2, 5)
    rectMode(CENTER)
  }

  jump() { //lets the enemy jump 
  if (!this.falling) { 
    this.pos.y--;
    this.vel.y = -15;
    this.falling = true; 
    }
  }

  stopFalling() { //stops the enemy from falling through the floor
    this.falling = false;
    this.accel.y = 0;
    this.vel.y = 0;
    this.pos.y = height
  }

  applyGravity() { //applies gravity to the enemy 
    if (this.falling && this.pos.y >= height) {
      this.stopFalling();
    }

    if (this.falling) { //accellerates the enemy under gravity 
      this.accel.y = 1;
    }
  }

  getHit() { //allows the enemy to be hit by bullets 
    for (let bullet of bullets){
      if (Math.sqrt(Math.pow(this.pos.x - bullet.pos.x, 2) + Math.pow(this.pos.y - bullet.pos.y, 2)) < (this.hitboxRadius + bullet.hitboxRadius)){
        this.getDamaged(10);
        console.log("ouch")
      }
    }
  }

  getDamaged(dmg) { //damages the enemy 
    this.health -= dmg
  }

  move() { //the enemy moves towards the player
    if (player.pos.y < this.pos.y && this.jumpNum < 10) { //only lets the enemy jump after a certain amount of time 
      this.jumpNum += 1;
    }else{
      this.jump();
      this.jumpNum = 0
    }
    if (player.pos.x < this.pos.x) {
      this.vel.x = -this.speed;
    }
    if (player.pos.x > this.pos.x) {
      this.vel.x = this.speed;
    }
    if (this.pos.x > width - 30) { //prevents the enemy from going off the screen
      this.vel.x = -2;
    }
    if (this.pos.x < 30) {
      this.vel.x = 2;
    }

    this.vel.add(this.accel);
    this.pos.add(this.vel);

    if (this.pos.y > height - 20) {
      this.stopFalling();
      this.pos.y = height - 20;
    }else{
      this.applyGravity();
    }
  }
}