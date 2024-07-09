function tilesFromImage(width, height, image, algorithm = "quantize") {
    const tileCount = width * height;
    let tiles = [];

    let mappedImage;

    switch (algorithm) {
        case "quantize":
            mappedImage = image_quantize(image);
            break;

        case "dither":
            mappedImage = image_dither(image);
            break;

        case "edge_detect":
            mappedImage = image_edge_detect(image);
            break;
    }

    for (let i = 0; i < tileCount; i++) {
        const tile = new Tile();

        if (mappedImage[i] == 255) {
            tile.setGood();
        }
        else {
            tile.setBad();
        }

        tiles.push(tile);
    }

    return tiles;
}

function tilesFromSeed(width, height, seed, difficulty) {
    const tileCount = width * height;
    let tiles = [];

    for (let i = 0; i < tileCount; i++) {
        const tile = new Tile();

        const seedStep = (seed + i) * i;
        const potentialTile = genRandomInt(0, 120, seedStep);
        const threshold = clamp(difficulty, 0, 100);

        if (potentialTile > threshold) {
            tile.setGood();
        }
        else {
            tile.setBad();
        }

        tiles.push(tile);
    }

    return tiles;
}

function tilesFromRaw(width, height, goodBadTiles) {
    const tileCount = width * height;
    let tiles = [];

    for (let i = 0; i < tileCount; i++) {
        const tile = new Tile();

        if (goodBadTiles[i] == "1") {
            tile.setGood();
        }
        else {
            tile.setBad();
        }

        tiles.push(tile);
    }

    return tiles;
}