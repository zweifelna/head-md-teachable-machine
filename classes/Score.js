class Score {
    constructor() {
        this.minSize = 64;
        this.maxSize = this.minSize * 1.2;
        this.size = this.minSize;
    }

    update() {
        fill(0);
        textSize(this.size);
        strokeWeight(1);
        text(score, width - width * .1, height * .1);
    }

    grow() {
        anime({
            targets: this,
            size: this.maxSize,
            duration: 50,
            easing: 'easeOutSine',
            complete: () => {
                anime({
                    targets: this,
                    size: this.minSize,
                    duration: 50,
                    easing: 'easeOutSine',
                });
            },
        });
    }
}