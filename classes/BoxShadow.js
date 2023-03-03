class BoxShadow {
    constructor() {
        this.minRadius = boxRadius;
        this.maxRadius = this.minRadius * 1.4;
        this.radius = this.minRadius;
        this.center = boxCenter;
        this.opacity = 255;
        this.display = true;

        anime({
            targets: this,
            radius: this.maxRadius,
            opacity: 0,
            duration: 250,
            easing: 'easeOutSine',
            complete: () => {
                this.display = false;
            },
        });
    }

    update() {
        noFill();
        stroke(color(0, 0, 0, this.opacity));
        strokeWeight(4);
        square(this.center.x, this.center.y, this.radius);
    }

}

