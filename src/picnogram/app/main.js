let width = 10;
let height = 10;
let seed = 0;
let randomizeSeed = true;
let difficulty = 20;

let game;
function start() {
    displayVersion();
    configureElementListeners();

    let seedTextBox = document.getElementById("seedTextBox");
    seedTextBox.value = genRandomInt(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, null);

    game = new Game();

    updateGameSettings();

    let tiles = tilesFromSeed(width, height, seed, difficulty);
    game.start(width, height, tiles, false);
}

document.addEventListener("DOMContentLoaded", (event) => {
    start();
});

function createGameFromSeed() {
    updateGameSettings();

    if (randomizeSeed) {
        let seedTextBox = document.getElementById("seedTextBox");
        let randSeed = genRandomInt(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, null);
        seedTextBox.value = randSeed;
        seed = randSeed;
    }

    let tiles = tilesFromSeed(width, height, seed, difficulty);
    game.start(width, height, tiles, false);
}

function createGameFromImage() {
    updateGameSettings();

    uploadImage();
}

function saveGame() {
    let output = [];

    output.push(width);
    output.push(height);
    output.push(seed);
    output.push(randomizeSeed);
    output.push(difficulty);

    let boardState = "";
    let tiles = game.getTiles();
    for (let i = 0; i < width * height; i++) {
        let state = tiles[i].getState();
        boardState += state + "|";
    }
    boardState = boardState.slice(0, -1);
    output.push(boardState);

    let goodTiles = "";
    for (let i = 0; i < width * height; i++) {
        goodTiles += (tiles[i].isGood() ? '1' : '0') + '|';
    }
    goodTiles = goodTiles.slice(0, -1);
    output.push(goodTiles);

    if (game.isImage()) {
        let inputCanvas = document.getElementById("inputImage");
        output.push(inputCanvas.toDataURL());
    }
    else {
        output.push("null")
    }

    let outputString = "";

    for (let i = 0; i < output.length; i++) {
        outputString += output[i] + '\n';
    }

    outputString = outputString.slice(0, -1);

    const defaultFilename = 'my_game.picno';
    const blob = new Blob([outputString], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = defaultFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function loadGame() {
    let input = document.getElementById('loadGameFile');
    if (!input) {
        window.alert("Couldn't find the loadGameFile element.");
    }
    else if (!input.files) {
        window.alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        window.alert("Please select a file.");
    }
    else {
        let file = input.files[0];
        let fr = new FileReader();
        fr.onload = function (event) {
            let fileContent = event.target.result;
            let gameFile = fileContent.split('\n');

            width = gameFile[0];
            height = gameFile[1];
            seed = gameFile[2];
            randomizeSeed = gameFile[3];
            difficulty = gameFile[4];
            let modifiedTiles = gameFile[5].split('|');
            let goodBadTiles = gameFile[6].split('|');
            let image = gameFile[7];

            let imagePuzzle;

            if (image === "null") {
                imagePuzzle = false;
            }
            else {
                imagePuzzle = true;

                img = new Image();
                img.src = image;

                drawInput();
            }

            let tiles = tilesFromRaw(width, height, goodBadTiles);

            updateUI();
            updateGameSettings();

            game.start(width, height, tiles, imagePuzzle);

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let index = get1DIndex(x, y, width);
                    switch (modifiedTiles[index]) {
                        case "2":
                        case "3":
                            game.tiles[index].clickTile(true, false);
                            break;
                        case "1":
                            game.tiles[index].clickTile(true, true)
                            break;
                    }
                }
            }
        };
        fr.readAsText(file);
    }
}

function updateGameSettings() {
    width = parseInt(document.getElementById("widthTextBox").value, 10);
    height = parseInt(document.getElementById("heightTextBox").value, 10);
    seed = parseInt(document.getElementById("seedTextBox").value, 10);
    randomizeSeed = document.getElementById("randomizeCheckBox").checked;
    difficulty = parseInt(document.getElementById("difficultyTextBox").value, 10);
}

function updateUI() {
    document.getElementById("widthTextBox").value = width;
    document.getElementById("heightTextBox").value = height;
    document.getElementById("seedTextBox").value = seed;
    document.getElementById("randomizeCheckBox").checked = randomizeSeed == "true" ? true : false;
    document.getElementById("difficultyTextBox").value = difficulty;
}