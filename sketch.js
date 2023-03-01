/*MISC*/
// Things
let sound;
let conductor;

// Game state
let isPlaying = false;
let inGame = false;

/*GAME*/
// Box stuff
let boxCenter;
let boxRadius = 200;

// Notes stuff
let offset;
let notes = [];
const noteSpeed = 15;
const noteRadius = 160;

// Timer
let countdown;
let timer;

/*TITLE SCREEN*/
// Start menu
let startButton;

function preload() {
    sound = new Howl({
        src: ['./margot.mp3'],
        onend: function () { isPlaying = false; }
    })
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    textAlign(CENTER);

    /*TITLE SCREEN*/
    // Start button
    startButton = createButton('Start');
    startButton.position(windowWidth / 2, windowHeight / 2);
    startButton.mousePressed(start);

    /*GAME*/
    // Box
    boxCenter = createVector(width / 2, height * .65);

    // Notes
    offset = (width / 2 + noteRadius / 2) / noteSpeed;

    //Timer 
    timer = createDiv('');
    // timer.style('font-size', '64px');
    timer.position(width / 2, height / 2);
}

function draw() {
    if (isPlaying) {
        background(220);

        /*GAME*/
        // Box
        square(boxCenter.x, boxCenter.y, boxRadius);

        if (conductor !== undefined) {
            if (conductor.shouldSpawnNote()) {
                notes.push(new Note({ speed: noteSpeed, radius: noteRadius }));
            }
        }

        notes.forEach(note => {
            note.update();
        });
    }
}

let start = () => {
    // Change game state
    isPlaying = true;

    // Destroy the startButton
    startButton.remove();

    // Start the countdown
    startCountdown();

    // Wait 1 second then start the game
    setTimeout(() => {
        // Start the music
        sound.play();

        // Start the conductor
        conductor = new Conductor(120);
        conductor.start(offset);
    }, 1000);
}

let startCountdown = () => {
    countdown = 3;
    timer.html(countdown);
    const interval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            timer.html(countdown);
        } else if (countdown === 0) {
            timer.html('GO!');
        } else {
            // timer.hide();
            clearInterval(interval);
        }
    }, 1000 / 3);
}


//quand label == ce qu'on veut → incrémenter un counter
//quand counter > counterthreshold → prendre en compte l'input + reset counter