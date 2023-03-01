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

// Classifier Variable
let classifier;

// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/M2Z0uvmy7/';

// Video
let video;
let flippedVideo;

// To store the classification
let label = "";



/*TITLE SCREEN*/
// Start menu
let startButton;

function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
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

    // Create the video
    video = createCapture(VIDEO);
    video.size(320, 240);
    video.hide();
    flippedVideo = ml5.flipImage(video)

    // Start classifying
    classifyVideo();
}

function draw() {
    if (isPlaying) {
        background(220);

        // Draw the video
        image(flippedVideo, 0, 0);

        // Draw the label
        fill(0);
        textSize(16);
        textAlign(CENTER);
        text(label, width / 2, height - 4);

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
    if (activeNote.position.x > boxCenter.x + boxRadius / 2 + noteRadius / 2) {
        activeNote = notes[notes.indexOf(activeNote) + 1];
    }
}

// Get a prediction for the current video frame
function classifyVideo() {
    flippedVideo = ml5.flipImage(video)
    classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
    // If there is an error
    if (error) {
        console.error(error);
        return;
    }
    // The results are in an array ordered by confidence.
    // console.log(results[0]);
    label = results[0].label;
    // Classifiy again!
    classifyVideo();
}

keyPressed = () => {
    console.log(keyCode);
    if (keyCode == 81) {    //rock

    }
    if (keyCode == 87) {    //paper

    }
    if (keyCode == 69) {    //scissors

    }

    if (activeNote.type == 0) {
        if (keyCode == 81) {
            console.log("rock réussi!");
        } else {
            console.log("rock raté!");
        }
    }

    if (activeNote.type == 1) {
        if (keyCode == 87) {
            console.log("paper réussi!");
        } else {
            console.log("paper raté!");
        }
    }

    if (activeNote.type == 2) {
        if (keyCode == 69) {
            console.log("scissors réussi!");
        } else {
            console.log("scissors raté!");
        }
    }
}

//quand label == ce qu'on veut → incrémenter un counter
//quand counter > counterthreshold → prendre en compte l'input + reset counter