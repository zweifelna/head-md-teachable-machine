class Message {
    constructor(type, position) {
        this.type = type;
        this.direction = createVector(random(-1, 1), -1);
        this.opacity = 255;
        this.width = 200;
        this.height = this.width;
        this.position = new p5.Vector(width / 2 + boxRadius, boxCenter.y - boxRadius);
        this.missPosition = new p5.Vector(width / 2 + boxRadius / 1.75, boxCenter.y + boxRadius / 1.75);

    }

    update() {
        tint(255, this.opacity);

        switch (this.type) {
            case 0: //perfect
                image(perfect, this.position.x, this.position.y, this.width, this.height);
                this.position = p5.Vector.add(this.position, new p5.Vector(1, -1));
                break;
            case 1: //ok
                image(ok, this.position.x, this.position.y, this.width, this.height);
                this.position = p5.Vector.add(this.position, new p5.Vector(1, -1));
                break;
            case 2: //miss
                image(miss, this.missPosition.x, this.missPosition.y, this.width, this.height);
                this.missPosition = p5.Vector.add(this.missPosition, new p5.Vector(1, 1));
                break;
        }

        this.opacity -= 10;
        if (this.opacity <= 0) {
            messages.shift();
        }
    }
}