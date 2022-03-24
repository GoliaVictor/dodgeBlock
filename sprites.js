class Bird {
    constructor (x, y, speed, sizeX, sizeY, fill, stroke) {
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.fill = fill;
        this.stroke = stroke;
        this.speed = speed;
        this.direction = 1;
        try {
            this.playerLeft = intersection.createRect(this.x-width,this.y,this.sizeX,this.sizeY,this.fill,this.stroke);
            this.player = intersection.createRect(this.x+width,this.y,this.sizeX,this.sizeY,this.fill,this.stroke);
            this.playerRight = intersection.createRect(this.x+width,this.y,this.sizeX,this.sizeY,this.fill,this.stroke);
        } catch {}

    }
    update() {
        this.move();
        this.show();
    }

    jump() {
        this.direction = -this.direction;
    }

    move() {
        this.x += this.direction*this.speed;
    }

    show() {
        intersection.updateRect(this.playerLeft,{shapeX: this.x-width, fill: this.fill});
        intersection.updateRect(this.player,{shapeX: this.x, fill: this.fill});
        intersection.updateRect(this.playerRight,{shapeX: this.x+width, fill: this.fill});
    }
}

class Dodge {
    constructor (x, y, speed, sizeX, sizeY, fill, type) {
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.fill = fill;
        this.type = type;
        this.speed = speed;
        this.player = intersection.createRect(this.x,this.y,this.sizeX,this.sizeY,this.fill,undefined,0);
    }
    update() {
        this.move();
        this.show();
    }
    
    move() {
        this.y += this.speed;
    }

    show() {
        intersection.updateRect(this.player,{shapeY: this.y});
    }
}