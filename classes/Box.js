class Box {
    constructor() {
        this.minRadius = boxRadius;
        this.maxRadius = this.minRadius * 1.2;
        this.radius = this.minRadius;
        this.center = boxCenter;
        this.isGrowing = false;
    }

    show() {
        noFill();
        stroke(255);
        square(this.center.x, this.center.y, this.radius);
    }

    grow() {
        if (this.isGrowing) {
            anime({
                targets: this,
                radius: this.maxRadius,
                duration: 50,
                easing: 'easeOutSine',
                complete: () => {
                    anime({
                        targets: this,
                        radius: this.minRadius,
                        duration: 50,
                        complete: () => {
                            this.isGrowing = false;
                        },
                    });
                },
            });
        }
    }
}

