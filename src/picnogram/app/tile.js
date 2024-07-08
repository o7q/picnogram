// states
// 0: unchecked/unmarked
// 1: marked
// 2: checked
// 3: wrongly checked
class Tile {
    appendNumberTile(numberTile) {
        this.numberTiles.push(numberTile);
    }

    setGood() {
        this.good = true;
    }

    setBad() {
        this.good = false;
    }

    isGood() {
        return this.good;
    }

    getState() {
        return this.state;
    }

    setState(state) {
        this.state = state;
    }

    clickTile(click, forceMark) {
        if (this.state === 3 || this.state === 2) {
            return;
        }

        if (!MOUSE_DOWN && !click) {
            return;
        }

        let canDisable = true;
        if (CONTROL_KEY_DOWN && this.state === 1) {
            this.state = 0;
            canDisable = false;
        }

        if ((CONTROL_KEY_DOWN && this.state === 0 && canDisable) || forceMark) {
            this.state = 1;
        }

        if (!CONTROL_KEY_DOWN && !forceMark) {
            if (this.good) {
                this.state = 2;

                for (let i = 0; i < this.numberTiles.length; i++) {
                    this.numberTiles[i].increment();
                }
            }
            else {
                this.state = 3;
            }
        }

        let color = "rgb(255, 255, 255)";

        switch (this.state) {
            case 1:
                color = "rgb(122, 122, 122)";
                break;
            case 2:
                color = "rgb(56, 255, 109)";
                break;
            case 3:
                color = "rgb(255, 56, 56)";
                break;
        }

        let div = document.getElementById("tile" + this.id);
        div.style.backgroundColor = color;
    }

    create(index, position, tileSize) {
        let div = document.createElement("div");
        div.setAttribute("class", "tile");
        div.setAttribute("id", "tile" + index);
        div.style.left = (position.x * tileSize) + 'px';
        div.style.top = (position.y * tileSize) + 'px';
        div.style.width = tileSize + 'px';
        div.style.height = tileSize + 'px';

        this.state = 0;
        this.id = index;

        this.numberTiles = [];

        div.addEventListener('mouseover', (e) => {
            this.clickTile(false, false);
        }, false);
        div.addEventListener('mousedown', (e) => {
            this.clickTile(true, false);
        }, false);
        document.body.appendChild(div);
    }
}

class NumberTile {
    create(number, position, tileSize, id, side) {
        let div = document.createElement("div");
        div.setAttribute("class", "tile numberTile tileText");
        div.style.left = (position.x * tileSize) + 'px';
        div.style.top = (position.y * tileSize) + 'px';

        div.style.width = tileSize + 'px';
        div.style.height = tileSize + 'px';
        div.style.color = "#a1a1a1";

        let textSpan = document.createElement("span");
        textSpan.setAttribute("class", "tileText");
        textSpan.setAttribute("id", `tileText_${side}${id}`);
        textSpan.textContent = number;
        textSpan.style.fontSize = (25 / (50 / tileSize)) + 'px';
        div.appendChild(textSpan);

        this.number = number;
        this.id = `${side}${id}`;

        document.body.appendChild(div);
    }

    increment() {
        if (this.number > 0) {
            this.number = this.number - 1;
        }

        if (this.number === 0) {
            let text = document.getElementById(`tileText_${this.id}`)
            text.style.color = "rgb(79, 79, 79)";
        }
    }
}