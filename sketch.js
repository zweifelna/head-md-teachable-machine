/*MISC*/
// Things
let sound;
let conductor;

let rock;
let paper;
let scissors;

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
const noteSpeed = 12;
const noteRadius = 160;
let activeNote;

// Timer
let countdown;
let timer;

/*TITLE SCREEN*/
// Start menu
let startButton;

function preload() {
    sound = new Howl({
        src: ['./assets/margot.mp3'],
        onend: function () { isPlaying = false; }
    })

    rock = loadImage('assets/rock.png');
    paper = loadImage('assets/paper.png');
    scissors = loadImage('assets/scissors.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    ellipseMode(CENTER);
    textAlign(CENTER);
    imageMode(CENTER);
    frameRate(60);

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
}

function draw() {
    if (isPlaying) {
        background(220);

        /*GAME*/
        // Box
        fill(color(255, 255, 255));
        square(boxCenter.x, boxCenter.y, boxRadius);
        line(width / 2, 0, width / 2, height);

        if (conductor !== undefined) {
            if (conductor.shouldSpawnNote()) {
                let newNote = new Note({ speed: noteSpeed, radius: noteRadius });
                notes.push(newNote);
            }
        }

        notes.forEach(note => {
            note.update();
            if (activeNote == note) {
                note.isActive = true;
            } else {
                note.isActive = false;
            }

            // if (note.position.x > width + note.radius) {
            //     notes.shift();          // pourquoi stutter?
            // }
        });

        if (notes.length == 1) {
            activeNote = notes[0];
        }

        if (notes.length > 0) {
            setActiveNote();
        }
    }

    // console.log(frameRate());
}

let start = () => {
    // Change game state
    isPlaying = true;

    // Destroy the startButton
    startButton.remove();

    // Wait 1 second then start the game
    setTimeout(() => {
        // Start the music
        sound.play();

        // Start the conductor
        conductor = new Conductor(70);
        conductor.start(offset);
    }, 1000);
}



let setActiveNote = () => {
    notes.forEach(note => {
        // if (note.position.x > boxCenter.x + boxRadius / 2 + note.radius / 2) {
        //     notes.shift();
        // }


        // if (notes[notes.indexOf(note) + 1] == undefined) {
        //     console.log('return');
        //     return;
        // } else {
        //     console.log('pas return');
        // }
        // if (note.position.x < boxCenter.x + boxRadius / 2 + note.radius / 2
        //     && notes.indexOf(note) < notes.indexOf()
        // ) {
        //     activeNote = note;
        // }


        if (activeNote.position.x > boxCenter.x + boxRadius / 2 + noteRadius / 2) {
            activeNote = notes[notes.indexOf(activeNote) + 1];
        }
    });
}

//quand label == ce qu'on veut → incrémenter un counter
//quand counter > counterthreshold → prendre en compte l'input + reset counter