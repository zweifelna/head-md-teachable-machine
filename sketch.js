/*MISC*/
// Things
let sound;

let rock;
let paper;
let scissors;

// Game state
let isPlaying = false;
let inGame = false;

/*GAME*/
// Box stuff
let box;
let boxCenter;
let boxRadius = 200;

// Notes stuff
let offset;
let notes = [];
const noteSpeed = 12;
const noteRadius = 160;
let activeNote;
let lastNote = 0;

// Messages
let messages = [];

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
    sound = loadSound('assets/margot.mp3')
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
    box = new Box();

    // Notes
    offset = (width / 2 + noteRadius / 2 * 2) / noteSpeed;

    // Create video
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
        image(video, windowWidth / 2, windowHeight / 6);

        // Draw the label
        fill(0);
        textSize(16);
        textAlign(CENTER);
        text(label, width / 2, height - 4);

        /*GAME*/
        // Box
        box.show();
        box.grow();

        if (millis() > lastNote + 1000) {
            let newNote = new Note({ speed: noteSpeed, radius: noteRadius });
            notes.push(newNote);
            lastNote = millis();
        }

        notes.forEach((note, i, object) => {
            // Set the active note
            if (activeNote == note) {
                note.isActive = true;
            } else {
                note.isActive = false;
            }

            // Check is note is out of screen
            if (note.position.x > width + note.radius) {
                object.splice(i, 1)
            }

            // Update the note
            note.update();
        });

        if (activeNote !== undefined) {
            if (activeNote.position.x > boxCenter.x - boxRadius / 4 && activeNote.noteTriggered == false) {
                box.isGrowing = true;
                activeNote.noteTriggered = true;
            }
        }

        if (notes.length == 1) {
            activeNote = notes[0];
        }

        if (notes.length > 0) {
            setActiveNote();
        }

        messages.forEach((message) => {
            message.update();
        });
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
    }, 1000);
}

let setActiveNote = () => {
    if (activeNote.position.x > boxCenter.x + boxRadius / 2 + noteRadius / 2) {
        missedNote(activeNote);
        if (notes[notes.indexOf(activeNote) + 1] !== undefined) activeNote = notes[notes.indexOf(activeNote) + 1];
    }
}

// Get a prediction for the current video frame
function classifyVideo() {
    //flippedVideo = ml5.flipImage(video)
    classifier.classify(video, gotResult);
}

// When we get a result
function gotResult(error, results) {
    // If there is an error
    if (error) {
        console.error(error);
        return;
    }
    // The results are in an array ordered by confidence.
    label = results[0].label;
    // Classifiy again!
    classifyVideo();
}

keyPressed = () => {
    // DEBUG
    // if (keyCode == 32) {
    //     // let newNote = new Note({ speed: noteSpeed, radius: noteRadius });
    //     // notes.push(newNote);
    //     // if (notes.length == 1) {
    //     //     activeNote = notes[0];
    //     // }

    //     box.isGrowing = true;
    // }

    if (activeNote.type == 0) {
        if (keyCode == 81) {
            successNote(activeNote);
        } else {
            missedNote(activeNote);
        }
    }

    if (activeNote.type == 1) {
        if (keyCode == 87) {
            successNote(activeNote);
        } else {
            missedNote(activeNote);
        }
    }

    if (activeNote.type == 2) {
        if (keyCode == 69) {
            successNote(activeNote);
        } else {
            missedNote(activeNote);
        }
    }
}

let missedNote = (note) => {
    if (!note.hasMessage) {
        let message = new Message("missed", note.position);
        messages.push(message);
        note.hasMessage = true;
    }
}

let successNote = (note) => {
    if (!note.hasMessage) {
        if (note.isInPerfectZone()) {
            let message = new Message("parfait!", note.position);
            messages.push(message);
            note.hasMessage = true;
        } else if (note.isInOkZone()) {
            let message = new Message("ok~", note.position);
            messages.push(message);
            note.hasMessage = true;
        } else if (!note.isInOkZone() && !note.isInPerfectZone()) {
            missedNote(note);
        }
    }
}

//quand label == ce qu'on veut → incrémenter un counter
//quand counter > counterthreshold → prendre en compte l'input + reset counter