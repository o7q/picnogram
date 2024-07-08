const edge_detection_kernel = [
    0.25, 0, -0.25,
    0.50, 0, -0.50,
    0.25, 0, -0.25
];

function genRandomInt(min, max, seed = null) {
    min = Math.ceil(min);
    max = Math.floor(max);

    let rand;
    if (seed == null)
    {
        rand = Math.random();
    }
    else
    {
        rand = splitmix32(seed);
    }

    return Math.floor(rand * (max - 1 - min + 1)) + min;
}

function get1DIndex(x, y, width) {
    return y * width + x;
}

function get2DIndex(i, width) {
    let x = i % width;
    let y = Math.floor(i / width);

    return { x, y };
}

function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

function quantize(input, values) {
    let closestIndex = 0;
    let lowestDistance = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < values.length; i++) {
        const distance = Math.abs(input - values[i]);

        if (distance < lowestDistance) {
            lowestDistance = distance;
            closestIndex = i;
        }
    }

    return values[closestIndex];
}

// random function from
// https://stackoverflow.com/a/47593316
function splitmix32(a) {
    a |= 0;
    a = a + 0x9e3779b9 | 0;
    let t = a ^ a >>> 16;
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ t >>> 15;
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
}
//