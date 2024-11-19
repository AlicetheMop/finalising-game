/*Written by Samuel Orchard on 1st - 5th November 2024
this file contains the code for the bullets class which initialises the bullets speed, direction and damage
*/
class Bullet{
    constructor(startX, startY, newAngle){ //initialises the variables for the bullet class
      this.size = 10;
      this.speed = 20;
      this.angle = newAngle;
      this.pos = createVector(startX,startY);
      this.vel = createVector(sin(this.angle)*this.speed,cos(this.angle)*this.speed); //gives the bullet veloctiy at an angle so it can travel to the exact point the mouse is at
      this.hitboxRadius = 5;
      this.damage = 10;
    }
    

    move(){
      this.pos.add(this.vel);
    }
  
    update(){
      this.move();
    }
  
    checkOnScreen(){
      return (this.pos.x < width && this.pos.x > 0 && this.pos.y > 0 && this.pos.y < height)
    }
  
    display(){ //displays the bullets
      push()
      fill("yellow")
      translate(this.pos.x,this.pos.y);
      rotate(-this.angle+180);
      circle(0, 0,this.size)
      pop()
    }
    
  }