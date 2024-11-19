/*
Written by Samuel Orchard, on the 3rd - 5th July 2024
this code is for the enemy object, it contains all the code for the enemy initialisation, movement, damage, health and collision detection with the floor and walls
*/

class Enemy {
  constructor() { //initiates all the variables for the enemy class including the position, velocity and acceleration
    this.pos = createVector((width - 1) * Math.random() + 1, (height - 1) * Math.random() + 1);
    this.vel = createVector(0, 0);
    this.accel = createVector(0, 0);
    this.health = 100;
    this.falling = true;
    this.hitboxRadius = 15
  }

  draw() { //draws the enemy
    fill("red")
    rect(this.pos.x, this.pos.y, 30, 30)
    rectMode(CORNER)
    fill("black")
    rect(this.pos.x - 25, this.pos.y + 15, 50, 5)
    fill("red")
    rect(this.pos.x - 25, this.pos.y + 15, this.health/2, 5) //draws the enemy health bar 
    rectMode(CENTER)
  }

  jump() { //lets the enemy jump if they are on the ground 
    if (!this.falling) { 
      this.pos.y--;
      this.vel.y = -20;
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
        bullets.splice(bullet ,1)
        console.log("ouch")
      }
    }
  }

  getDamaged(dmg) { //damages the enemy 
    this.health -= dmg
  }

  move() { //the enemy moves towards the player
    let jumpNum = Math.random() * 1000; //randomises the enemy's jumps
    let moveNum = Math.random() * 100; //randomises the enemy's right movement

    if (jumpNum > 990) {
      this.jump();
    }
    if (moveNum < 5) {
      this.vel.x = -4;
    }
    if (moveNum >= 95) {
      this.vel.x = 4;
    }
    if (this.pos.x > width - 30) { //prevents the enemy from going off the screen
      this.pos.x = width - 30;
    }
    if (this.pos.x < 30) {
      this.pos.x = 30;
    }

    this.vel.add(this.accel);
    this.pos.add(this.vel);

    if (this.pos.y > height - 20) { //prevents the enemy falling through the ground 
      this.stopFalling();
      this.pos.y = height - 20;
    } else { //applies gravity when the enemy is above the ground 
      this.applyGravity();
    }
  }
}