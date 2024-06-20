const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const fieldHeight = 3;
const fieldWidth = 3;
const holeCoverage = 0.2;

const dummyField = [
    ['*', '░', 'O'],
    ['░', 'O', '░'],
    ['░', '^', '░']
];

class Field {
    constructor(field) {
        this.field = field;
        this.currentLocation = this.getStartLocation();
        this.gameOver = false;
    }
    getStartLocation() {
        for (let y = 0; y < this.field.length; y++) {
            for (let x = 0; x < this.field[y].length; x++) {
                if (this.field[y][x] === pathCharacter) {
                    return { x, y };
                }
            }
        }
    }
    getMove() {
        const move = prompt('Which way?').toUpperCase();
        switch (move) {
            case 'D':
                return { x: 0, y: -1 };
            case 'U':
                return { x: 0, y: 1 };
            case 'L':
                return { x: -1, y: 0 };
            case 'R':
                return { x: 1, y: 0 };
            default:
                console.log('Enter D(down), L(left), U(up), or R(right)');
                return this.getMove();
        }
    }
    getNextLocation() {
        const nextLocation = this.getMove();
        return {
            x: this.currentLocation.x + nextLocation.x,
            y: this.currentLocation.y + nextLocation.y
        };
    }
    checkLocationOutOfBounds(nextLocation) {
        const { x, y } = nextLocation;
        if (x < 0 || y < 0 || y > this.field.length || x > this.field[y].length) {
            return true;
        }
        return false;
    }
    checkLocationHatOrHole(nextLocation) {
        const { x, y } = nextLocation;
        if (this.field[y][x] === hat) {
            console.log('Congrats! You found your hat!');
            return true;
        } else if (this.field[y][x] === hole) {
            console.log('You fell into a hole! Game Over!');
            return true;
        }
    }
    updateLocation() {
        this.currentLocation = this.getNextLocation();
        if (this.checkLocationOutOfBounds(this.currentLocation)) {
            console.log('Out of bounds!');
            return false;
        }
        if (this.checkLocationHatOrHole(this.currentLocation)) {
            this.gameOver = true;
            setTimeout(() => {
                console.clear();
            }, 3000);
            return true;
        }
        this.field[this.currentLocation.y][this.currentLocation.x] = pathCharacter;
    }
    print() {
        console.clear();
        this.field.forEach((row) => {
            console.log(row.join(' '));
        });
    }
}

// todo: determine hat and start position first. Then get the amount of holes by percentage from height/width, get random coordinates for each hole, and place them on the field.
function generateField(height, width, percentage) {
    const field = new Array(height).fill(0).map(() => new Array(width).fill(fieldCharacter));
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            field[i][j] = Math.random() < percentage ? hole;
        }
    }
    const hatLocation = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
    };
    // console.log(hatLocation);
    field[hatLocation.y][hatLocation.x] = hat; // todo: avoid hat location overlap with hole or start location
    field[0][0] = pathCharacter; // todo: randomize start location
    return field;
}

// Main Game Loop
// const game = new Field(dummyField);
// while (!game.gameOver) {
//     game.print();
//     game.updateLocation();
// }

// Tests

// console.log(generateField(4, 4, 0.2));

// console.log(getStartLocation(dummyField)); // { x: 0, y: 0 }
// console.log(
//     getStartLocation([
//         ['░', '░', 'O'],
//         ['░', 'O', '*'],
//         ['░', '░', '░']
//     ])
// ); // { x: 1, y: 2 }
// console.log(
//     getStartLocation([
//         ['░', '░', 'O'],
//         ['░', 'O', '░'],
//         ['░', '░', '░']
//     ])
// ); // undefined

// console.log(checkLocationOutOfBounds({ x: 0, y: 4 }, dummyField)); // true
// console.log(checkLocationOutOfBounds({ x: -1, y: 0 }, dummyField)); // true
// console.log(checkLocationOutOfBounds({ x: 0, y: 2 }, dummyField)); // false
// console.log(checkLocationOutOfBounds({ x: 3, y: 0 }, dummyField)); // false

// console.log(checkLocationHatOrHole({ x: 1, y: 2 }, dummyField)); // Congrats! You found your hat!
// console.log(checkLocationHatOrHole({ x: 1, y: 1 }, dummyField)); // You fell into a hole! Game Over!
