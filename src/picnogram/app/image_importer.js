// image importer derived from:
// https://stackoverflow.com/a/13939150
// https://jsfiddle.net/z3JtC/4

let img;
function uploadImage() {
    let input, file, fr;

    if (typeof window.FileReader !== 'function') {
        window.alert("The file API isn't supported on this browser yet.");
        return;
    }

    input = document.getElementById('imageFile');
    if (!input) {
        window.alert("Couldn't find the imageFile element.");
    }
    else if (!input.files) {
        window.alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        window.alert("Please select an image.");
    }
    else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = createImage;
        fr.readAsDataURL(file);
    }

    function createImage() {
        img = new Image();
        img.onload = loadImage;
        img.src = fr.result;
    }

    function loadImage() {

        console.log("u");

        let inputCanvas = document.getElementById("inputImage");
        let downscaledCanvas = document.getElementById("downscaledImage");


        let inputContext = inputCanvas.getContext("2d");
        let downscaledContext = downscaledCanvas.getContext("2d");

        let canvasWidth = clamp(img.width, 1, 1000);
        let canvasHeight = canvasWidth * (img.height / img.width);

        inputCanvas.width = canvasWidth;
        inputCanvas.height = canvasHeight;

        inputContext.drawImage(img, 0, 0, canvasWidth, canvasHeight);

        downscaledCanvas.width = width;
        downscaledCanvas.height = height;

        downscaledContext.drawImage(img, 0, 0, width, height);

        let imageData = downscaledContext.getImageData(0, 0, width, height);
        let imagePixelData = imageData.data;

        let tiles = tilesFromImage(width, height, imagePixelData);

        game.start(width, height, tiles, true);
    }
}