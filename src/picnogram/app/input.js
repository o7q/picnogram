let CONTROL_KEY_DOWN = false;
let MOUSE_DOWN = false;

document.addEventListener('keydown', function (e) {
    if (e.key === 'Control') {
        CONTROL_KEY_DOWN = true;
    }
});
document.addEventListener('keyup', function (e) {
    if (e.key === 'Control') {
        CONTROL_KEY_DOWN = false;
    }
});

document.addEventListener('mousedown', function (e) {
    MOUSE_DOWN = true;
});
document.addEventListener('mouseup', function (e) {
    MOUSE_DOWN = false;
});

function configureElementListeners() {
    document.getElementById('seedTextBox').addEventListener('input', function (e) {
        document.getElementById("randomizeCheckBox").checked = false;
        updateGameSettings();
    });

    document.oncontextmenu = function (e) {
        return false;
    }
}