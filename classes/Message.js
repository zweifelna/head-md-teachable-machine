class Message {
    constructor(message, position) {
        this.message = message;
        this.position = position;

        //random bumber between -1 and 1
        this.direction = createVector(random(-1, 1), -1);
        this.opacity = 255;
    }

    update() {
        textSize(32);
        fill(color(0, 0, 0, this.opacity));
        text(this.message, this.position.x, this.position.y - 150);
        // this.position += this.direction;
        this.opacity -= 5;
        if (this.opacity <= 0) {
            messages.shift();
        }
    }
}