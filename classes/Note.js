class Note {
    constructor({ speed, radius }) {
        this.position = createVector(-radius / 2, height * .65);
        this.speed = speed;
        this.radius = radius;
    }

    update() {
        this.position.x += this.speed;
        circle(this.position.x, this.position.y, this.radius);
    }
}