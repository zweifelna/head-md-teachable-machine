class IncMessage {
    constructor(inc) {
        this.opacity = 255;
        this.width = 200;
        this.height = this.width;
        this.inc = inc;
    }

    update() {
        noStroke();
        fill(0, 0, 0, this.opacity);

        textSize(24);

        text("+" + this.inc, width - width * .1, height * .1 + 38);
        // this.position = p5.Vector.add(this.position, (new p5.Vector(1, 0)).normalize());

        this.opacity -= 7;
        if (this.opacity <= 0) {
            messages.shift();
        }
    }
}