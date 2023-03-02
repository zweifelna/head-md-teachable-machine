/*MISC*/
// Things
let sound;

let rock;
let paper;
let scissors;

let font;
let lastInput = 0;

// Counters
let rockCounter = 0;
let paperCounter = 0;
let scissorsCounter = 0;
let threshold = 20;

// Game state
let isPlaying = false;
let inGame = false;

/*GAME*/
// Score
let score = 0;
let scoreLabel;

// Box stuff
let box;
let boxCenter;
let boxRadius = 225;

// Notes stuff
let offset;
let notes = [];
const noteSpeed = 12;
const noteRadius = 160;
let activeNote;
let lastNote = 0;
let fft;

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

// Player
let playerGif;

/*TITLE SCREEN*/
// Start menu
let startButton;

function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
    sound = loadSound('assets/margot.mp3')
    font = loadFont('assets/font.ttf');
    rock = loadImage('assets/rock.png');
    paper = loadImage('assets/paper.png');
    scissors = loadImage('assets/scissors.png');
    perfect = loadImage('assets/perfect.png');
    ok = loadImage('assets/ok.png');
    miss = loadImage('assets/miss.png');
    playerGif = loadGif('assets/player.gif');
}

function setup() {
    lastInput = millis();
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    ellipseMode(CENTER);
    textAlign(CENTER);
    imageMode(CENTER);
    textFont(font);
    frameRate(60);

    /*TITLE SCREEN*/
    // Start button
    startButton = createButton('Start');
    startButton.position(windowWidth / 2, windowHeight / 2);
    startButton.mousePressed(start);

    /*GAME*/
    //Score
    scoreLabel = new Score();

    // Box
    boxCenter = createVector(width / 2, height * .75);
    box = new Box();

    // Notes
    offset = (width / 2 + noteRadius / 2 * 2) / noteSpeed;
    fft = new p5.FFT();

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
        background(255);

        // GIF
        tint(255, 255);
        image(playerGif, width / 2, height / 3);

        /*VIDEO*/
        // Draw the video
        tint(255);
        image(video, 200, 150);

        // Draw the video label
        fill(0);
        textSize(16);
        strokeWeight(1);
        textAlign(CENTER);
        text(label, 200, 300);

        // when the label is recognised, increase the counter
        if (activeNote != undefined) {
            if (label === "Rock") {
                rockCounter++;
            }

            if (label === "Paper") {
                paperCounter++;
            }

            if (label === "Scissors") {
                scissorsCounter++;
            }

            if (label === "Nothing") {
                rockCounter = 0;
                paperCounter = 0;
                scissorsCounter = 0;
            }
        }

        /*GAME*/
        // Score
        scoreLabel.update();

        // Box
        box.show();
        // box.grow();




        if (millis() > lastNote + 1000 && millis() < 136616) {
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
                note.display = false;
            }

            // Update the note
            note.update();
        });

        if (activeNote !== undefined) {
            if (activeNote.position.x > boxCenter.x - boxRadius / 4 && activeNote.noteTriggered == false) {
                // box.isGrowing = true;
                box.grow();
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

        // console.log(fft.getEnergy("bass"));

        // if (notes.length > 0) handleInput(); // À DECOMMENTER!!!!!!
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
    if (keyCode == 32) {
        // let newNote = new Note({ speed: noteSpeed, radius: noteRadius });
        // notes.push(newNote);
        // if (notes.length == 1) {
        //     activeNote = notes[0];
        // }

        // box.isGrowing = true;

        console.log(millis());
    }

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
        let message = new Message(2, note.position);
        messages.push(message);
        note.hasMessage = true;
    }
}

let successNote = (note) => {
    if (!note.hasMessage) {
        if (note.isInPerfectZone()) {
            let message = new Message(0, note.position);
            messages.push(message);
            note.hasMessage = true;
            increaseScore(3);
            note.scored();
        } else if (note.isInOkZone()) {
            let message = new Message(1, note.position);
            messages.push(message);
            note.hasMessage = true;
            increaseScore(1);
            note.scored();
        } else if (!note.isInOkZone() && !note.isInPerfectZone()) {
            missedNote(note);
        }
    }
}

let handleInput = () => {

    if (activeNote != undefined && millis() > lastInput + 750) {
        if (activeNote.type == 0) {
            lastInput = millis();
            if (rockCounter > threshold) {
                successNote(activeNote);
                rockCounter = 0;
                paperCounter = 0;
                scissorsCounter = 0;

            }
        }
        if (activeNote.type == 1) {
            lastInput = millis();
            if (paperCounter > threshold) {
                successNote(activeNote);
                rockCounter = 0;
                paperCounter = 0;
                scissorsCounter = 0;
            }
        }
        if (activeNote.type == 2) {
            lastInput = millis();
            if (scissorsCounter > threshold) {
                successNote(activeNote);
                rockCounter = 0;
                paperCounter = 0;
                scissorsCounter = 0;
            }
        }
    }
}

let increaseScore = (inc) => {
    score += inc;
    scoreLabel.grow();
}

//quand label == ce qu'on veut → incrémenter un counter
//quand counter > counterthreshold → prendre en compte l'input + reset counter