class ComboMessage {
    constructor(num) {
        this.opacity = 255;
        this.width = 200;
        this.height = this.width;
        this.position = new p5.Vector(width / 2 + boxRadius, boxCenter.y + boxRadius / 2 - boxRadius / 5);
    }

    update() {
        noStroke();
        fill(0, 0, 0, this.opacity);

        textSize(48);

        text("x" + combo, this.position.x, this.position.y, this.width, this.height);
        this.position = p5.Vector.add(this.position, (new p5.Vector(1, 0)).normalize());

        this.opacity -= 10;
        if (this.opacity <= 0) {
            messages.shift();
        }
    }
}