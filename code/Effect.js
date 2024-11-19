/*written by Samuel Orchard on 10th October 2024
This file contains the effect class and instructions on how to use it
 */
class Effect{
    constructor(newX, newY, newDuration){
      this.pos = createVector(newX,newY);
      this.duration = newDuration;
    }
  
    update(){
      this.duration--;
    }
  
    display(){};
    /*
      Display function defined on declaration.
      for example:
  
      myEffect = new Effect(50,50, 120);
      myEffect.display = function (){
        fill(255, this.duration);
        text("Effect lol", this.pos.x,this.pos.y);
      }
  
      you can set a function using = like that.
      that one just makes text that fades out as it goes on.
    */
  }