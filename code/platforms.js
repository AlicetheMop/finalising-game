class platforms{
    constructor(){
        this.pos  = createVector()
        this.pos.x = Math.random()*width;
        this.pos.y = Math.random()*height;
        this.moveable = false;
    }

    display(){
        fill("black")
        //rect(this.pos.x, this.pos.y, 100, 10)
    }
}