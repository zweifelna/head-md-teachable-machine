class Box {
    constructor() {
        this.minRadius = boxRadius;
        this.maxRadius = this.minRadius * 1.5;
        this.radius = this.minRadius;

        this.center = boxCenter;
        // this.duration = 1000;
        // this.startTime = null;
        this.isGrowing = false;
    }

    show() {
        noFill();
        stroke(255);
        square(this.center.x, this.center.y, this.radius);

        if (!this.isGrowing) {
            anime({
                targets: this.radius,
                translateX: [this.minRadius, this.maxRadius, this.minRadius], // from 100 to 250
                delay: 200,
                direction: 'alternate',
                loop: false,
                onended: () => {
                    this.isGrowing = false;
                }
            });
            // console.log('aled');
        }
    }
}

