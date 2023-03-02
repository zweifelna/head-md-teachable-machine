class Note {
    constructor({ speed, radius }) {
        this.position = createVector(-radius / 2, boxCenter.y);
        this.speed = speed;
        this.radius = radius;
        this.type = Math.floor(Math.random() * 3);  //0 → pierre, 1 → feuille, 2 → ciseaux
        this.isActive = false;
        this.hasMessage = false;
        this.noteTriggered = false;
        this.display = true;
        this.opacity = 255;
        this.maxSpriteSize = this.radius * 1.7;
        this.spriteSize = this.radius * 1.5;
    }

    update() {
        if (!this.display) return;
        this.position.x += this.speed;

        //DEBUG
        // if (this.isActive) {
        //     fill(color(255, 0, 0));
        // } else {
        //     fill(color(255, 255, 255));
        // }
        // circle(this.position.x, this.position.y, this.radius);

        tint(255, this.opacity);

        //resize image
        // rock.resize(this.spriteSize, this.spriteSize);
        // paper.resize(this.spriteSize, this.spriteSize);
        // scissors.resize(this.spriteSize, this.spriteSize);

        switch (this.type) {
            case 0:
                image(rock, this.position.x, this.position.y, this.spriteSize, this.spriteSize);
                break;
            case 1:
                image(paper, this.position.x, this.position.y, this.spriteSize, this.spriteSize);
                break;
            case 2:
                image(scissors, this.position.x, this.position.y, this.spriteSize, this.spriteSize);
                break;
        }
    }

    isInPerfectZone() {
        return (boxCenter.x - boxRadius / 2 < this.position.x && this.position.x < boxCenter.x + boxRadius / 2);

    }

    isInOkZone() {
        return (boxCenter.x - boxRadius / 2 - this.radius / 2 < this.position.x && this.position.x < boxCenter.x + boxRadius / 2 + this.radius / 2);
    }

    scored() {
        // this.disapear();
        anime({
            targets: this,
            opacity: 0,
            spriteSize: this.maxSpriteSize,
            duration: 250,
            easing: 'easeOutSine',
        });
    }
}