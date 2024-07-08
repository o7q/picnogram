class Game {
    start(width, height, tiles, isImagePuzzle) {
        this.purgeHTML();

        this.playAnimation = false;
        this.playedAnimation = false;
        this.completed = false;

        let completedCanvas = document.getElementById("completedImage");

        completedCanvas.width = 0;
        completedCanvas.height = 0;

        this.mouseClick = this.mouseClick.bind(this);
        this.mouseMove = this.mouseMove.bind(this);

        this.width = parseInt(width);
        this.height = parseInt(height);
        this.seed = seed;
        this.difficulty = difficulty;
        this.tileSize = clamp(500 / width, 20, 200);
        this.tileCount = width * height;

        this.paddingX = Math.ceil(this.width / 2) + (400 / this.tileSize);
        this.paddingY = Math.ceil(this.height / 2) + (10 / this.tileSize);

        this.tiles = tiles;

        this.isImagePuzzle = isImagePuzzle;

        this.drawTiles();
        this.drawNumberTiles();

        this.drawStats();
        this.updateStats();

        window.addEventListener("click", this.mouseClick);
        window.addEventListener("mousemove", this.mouseMove);

        // this.complete();
    }

    drawStats() {
        let textSpan = document.createElement("p");
        textSpan.setAttribute("class", "tileText statsText");
        textSpan.setAttribute("id", `statsText`);
        textSpan.textContent = "Correct: # | Wrong: # | Left: #";
        textSpan.style.left = (this.paddingX * this.tileSize) + 'px';
        textSpan.style.top = ((this.height + this.paddingY) * this.tileSize) + 'px';
        document.body.appendChild(textSpan);
    }

    updateStats() {
        let statsText = document.getElementById("statsText");
        statsText.textContent = `Correct: ${this.correctTiles} | Wrong: ${this.wrongTiles} | Left: ${this.tilesLeft}`;
    }

    mouseClick() {
        this.scanBoard();
        this.updateStats();
    }

    mouseMove() {
        if (MOUSE_DOWN) {
            this.scanBoard();
            this.updateStats();
        }
    }

    scanBoard() {
        let correctCount = 0;
        let wrongCount = 0;

        let goodTiles = 0;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let index = get1DIndex(x, y, this.width);
                if (this.tiles[index].isGood()) {
                    goodTiles++;
                }

                switch (this.tiles[index].getState()) {
                    case 2:
                        correctCount++;
                        break;
                    case 3:
                        wrongCount++;
                        break;
                }
            }
        }

        this.correctTiles = correctCount;
        this.wrongTiles = wrongCount;
        this.tilesLeft = goodTiles - correctCount;

        if (this.tilesLeft === 0) {
            this.completed = true;
        }

        if (this.completed && !this.playedAnimation) {
            if (this.isImagePuzzle) {
                this.playImageAnimation();
            } else {
                this.playConfettiAnimation();
            }
        }
    }

    drawTiles() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let index = get1DIndex(x, y, this.width);

                let x_pos = x + this.paddingX;
                let y_pos = y + this.paddingY;
                this.tiles[index].create(index, { x: x_pos, y: y_pos }, this.tileSize);
            }
        }
    }

    drawNumberTiles() {
        for (let y = this.height - 1; y >= 0; y--) {

            let count = 0;
            let lineCounts = [];
            let countIndex = 0;

            let indexes = [];

            for (let x = this.width - 1; x >= 0; x--) {
                let index = get1DIndex(x, y, this.width);
                let nextIndex = get1DIndex(x - 1, y, this.width);

                let isGoodTile = this.tiles[index].isGood();
                let isNextGoodTile = this.tiles[Math.max(nextIndex, 0)].isGood();

                if (isGoodTile) {
                    count++;

                    indexes.push(index);
                }

                let numberTile = false;

                if (((!isNextGoodTile || x == 0) && isGoodTile)) {
                    numberTile = new NumberTile();
                    numberTile.create(count, { x: this.paddingX - countIndex - 1, y: y + this.paddingY }, this.tileSize, index, "left");

                    for (let i = 0; i < indexes.length; i++) {
                        this.tiles[indexes[i]].appendNumberTile(numberTile);
                    }
                    indexes = [];

                    lineCounts.push(count);

                    count = 0;
                    countIndex++;
                }
            }
        }

        for (let x = this.width - 1; x >= 0; x--) {

            let count = 0;
            let lineCounts = [];
            let countIndex = 0;

            let indexes = [];

            for (let y = this.height - 1; y >= 0; y--) {
                let index = get1DIndex(x, y, this.width);
                let nextIndex = get1DIndex(x, y - 1, this.width);

                let isGoodTile = this.tiles[index].isGood();
                let isNextGoodTile = this.tiles[Math.max(nextIndex, 0)].isGood();

                if (isGoodTile) {
                    count++;

                    indexes.push(index);
                }

                if ((!isNextGoodTile && isGoodTile) || (y == 0 && isGoodTile)) {
                    let numberTile = new NumberTile();
                    numberTile.create(count, { x: x + this.paddingX, y: this.paddingY - countIndex - 1 }, this.tileSize, index, "top");

                    for (let i = 0; i < indexes.length; i++) {
                        this.tiles[indexes[i]].appendNumberTile(numberTile);
                    }
                    indexes = [];

                    lineCounts.push(count);

                    count = 0;
                    countIndex++;
                }
            }
        }
    }

    purgeHTML() {
        let confetti = document.getElementById("confettiGif");
        confetti.style.display = 'none';

        window.removeEventListener("click", this.mouseClick);
        window.removeEventListener("mousemove", this.mouseMove);
        document.querySelectorAll('.tile').forEach(e => e.remove());
        let statsText = document.getElementById("statsText");
        if (statsText) {
            statsText.remove();
        }
    }

    complete() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let index = get1DIndex(x, y, this.width);
                if (this.tiles[index].isGood()) {
                    this.tiles[index].clickTile(true, false);
                }
            }
        }
    }

    getTiles() {
        return this.tiles;
    }

    isImage() {
        return this.isImagePuzzle;
    }

    async playConfettiAnimation() {
        this.playedAnimation = true;

        let confetti = document.getElementById("confettiGif");

        const completedWidth = this.width * this.tileSize;
        const completedHeight = this.height * this.tileSize;

        confetti.style.left = (this.paddingX * this.tileSize) + 'px';
        confetti.style.top = (this.paddingY * this.tileSize) + 'px';
        confetti.style.width = completedWidth + 'px';
        confetti.style.height = completedHeight + 'px';
        confetti.classList.remove('fade-out');
        confetti.style.display = 'block';

        await this.pause(4000);

        confetti.classList.add('fade-out');
    }

    async playImageAnimation() {

        let confetti = document.getElementById("confettiGif");

        this.playAnimation = true;
        this.playedAnimation = true;

        let completedCanvas = document.getElementById("completedImage");
        let completedContext = completedCanvas.getContext("2d");

        let tempCanvas = document.getElementById("completedTemp");
        let tempContext = tempCanvas.getContext("2d");

        const steps = 20;
        const time = 4000 / steps;

        const completedWidth = this.width * this.tileSize;
        const completedHeight = this.height * this.tileSize;

        const stepWidth = (completedWidth - this.width) / steps;
        const stepHeight = (completedHeight - this.height) / steps;

        confetti.style.left = (this.paddingX * this.tileSize) + 'px';
        confetti.style.top = (this.paddingY * this.tileSize) + 'px';
        confetti.style.width = completedWidth + 'px';
        confetti.style.height = completedHeight + 'px';
        confetti.classList.remove('fade-out');
        confetti.style.display = 'block';

        completedCanvas.width = completedWidth;
        completedCanvas.height = completedHeight;

        completedCanvas.style.left = (this.paddingX * this.tileSize) + 'px';
        completedCanvas.style.top = (this.paddingY * this.tileSize) + 'px';

        completedContext.imageSmoothingEnabled = false;

        let tempWidth = this.width;
        let tempHeight = this.height;
        for (let i = 0; i < steps + 1; i++) {

            tempCanvas.width = tempWidth;
            tempCanvas.height = tempHeight;

            tempContext.drawImage(img, 0, 0, tempWidth, tempHeight);
            completedContext.drawImage(tempCanvas, 0, 0, completedWidth, completedHeight);

            if (!this.playAnimation) {
                break;
            }

            tempWidth += stepWidth;
            tempHeight += stepHeight;

            await this.pause(time);
        }

        confetti.classList.add('fade-out');
    }

    pause(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
}