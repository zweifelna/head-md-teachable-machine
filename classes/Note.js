class Note {
    constructor({ speed, radius }) {
        this.position = createVector(-radius / 2, height * .65);
        this.speed = speed;
        this.radius = radius;
        this.type = Math.floor(Math.random() * 3);  //0 → pierre, 1 → feuille, 2 → ciseaux
        this.isActive = false;
        this.hasMessage = false;
        this.noteTriggered = false;
    }

    update() {
        this.position.x += this.speed;
        if (this.isActive) {
            fill(color(255, 0, 0));
        } else {
            fill(color(255, 255, 255));
        }
        circle(this.position.x, this.position.y, this.radius);

        //resize image
        rock.resize(this.radius, this.radius);
        paper.resize(this.radius, this.radius);
        scissors.resize(this.radius, this.radius);

        switch (this.type) {
            case 0:
                image(rock, this.position.x, this.position.y);
                break;
            case 1:
                image(paper, this.position.x, this.position.y);
                break;
            case 2:
                image(scissors, this.position.x, this.position.y);
                break;
        }
    }

    isInPerfectZone() {
        return (boxCenter.x - boxRadius / 2 < this.position.x && this.position.x < boxCenter.x + boxRadius / 2);

    }

    isInOkZone() {
        return (boxCenter.x - boxRadius / 2 - this.radius / 2 < this.position.x && this.position.x < boxCenter.x + boxRadius / 2 + this.radius / 2);
    }
}