class Conductor {
    constructor(bpm) {
        this.bpm = bpm;
        this.spb = 60 / this.bpm;
        this.startTime = 0;
        this.lastSpawnedBeat = 0;
    }

    start() {
        this.startTime = millis();

    }

    getCurrentBeat() {
        const elapsed = (millis() - this.startTime) / 1000;
        return Math.floor(elapsed / this.spb);
    }

    shouldSpawnNote() {
        const currentBeat = this.getCurrentBeat();
        if (currentBeat > this.lastSpawnedBeat) {
            this.lastSpawnedBeat = currentBeat;
            return true;
        }
        return false;
    }
}
