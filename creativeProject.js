const gameBoard = document.getElementById("game-canvas");
const resetButton = document.getElementById("reset-button");
let ctx = gameBoard.getContext("2d");
let gameOver = false;
let reset = false;
let width = 480;
let height = 480;
let nephiCondition = {
    x: 1,
    y: 1,
    sword : false,
    plate : false
}
let currentNephi = null;
let nephiObj = new Image();
let nephiObjPlate = new Image();
let nephiObjSword = new Image();
let nephiObjBoth = new Image();
let swordObj = new Image();
let plateObj = new Image();
let labanObj = new Image();

const initialBoard = [
    [0,0,0,0,0,0,0,0,],
    [0,1,0,0,0,0,3,0,],
    [0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,],
    [0,0,4,0,0,0,0,2,],
];

let gBoard = initialBoard.map(row => row.slice());

let imagesLoaded = 0;

function onImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === 7) {
        initialize();
    }
}

// Assign onload handlers
nephiObj.onload = onImageLoad;
nephiObjPlate.onload = onImageLoad;
nephiObjSword.onload = onImageLoad;
nephiObjBoth.onload = onImageLoad;
plateObj.onload = onImageLoad;
swordObj.onload = onImageLoad;
labanObj.onload = onImageLoad;


// Set sources (this starts the loading)
swordObj.src = "images/sword.png";
nephiObj.src = "images/nephi.png";
labanObj.src = "images/laban.png";
nephiObjPlate.src = "images/nephiPlate.png";
nephiObjSword.src = "images/nephiSword.png";
nephiObjBoth.src = "images/nephiBoth.png";
plateObj.src = "images/plate.png";

function initialize() {
    // Initialize the game board
    gameBoard.width = 480;
    gameBoard.height = 480;
    width = gameBoard.width;
    height = gameBoard.height;

    gameBoard.style.border = "1px solid black";
    gameBoard.style.backgroundColor = "lightblue";
    currentNephi = nephiObj;
    backgroundColor();
    draw();
}


function backgroundColor(){
    ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);
    ctx.fillStyle = "rgb(192, 255, 66)";
    ctx.fillRect(0, 0, gameBoard.width, gameBoard.height);
    ctx.strokeStyle = "rgb(34, 51, 0)";
    ctx.lineWidth = 3;
}

function draw() {
    let w = width / 8;
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            let d = gBoard[y][x];

            // Draw grid outline
            ctx.strokeStyle = "rgb(34, 51, 0)";
            ctx.lineWidth = 1;
            ctx.strokeRect(x * w, y * w, w, w);

            // reset previous color
            ctx.fillStyle = "rgb(192, 255, 66)";
            ctx.fillRect(x * w, y * w, w, w);

            if (d == 0) {
                ctx.fillStyle = "rgb(192, 255, 66)";
                ctx.fillRect(x * w, y * w, w, w);
            } else if (d == 1) {
                ctx.fillStyle = "rgba(0, 200, 255, 0.6)";
                ctx.fillRect(x * w, y * w, w, w);
                ctx.drawImage(currentNephi, x * w, y * w, w, w);
            } else if (d == 2) {
                ctx.fillStyle = "rgba(16, 204, 169, 0.3)";
                ctx.fillRect(x * w, y * w, w, w);
                ctx.drawImage(swordObj, x * w, y * w, w, w);
            } else if (d == 3) {
                ctx.fillStyle = "rgba(16, 204, 169, 0.3)";
                ctx.fillRect(x * w, y * w, w, w);
                ctx.drawImage(plateObj, x * w, y * w, w, w);
            } else if (d == 4){
                ctx.fillStyle = "rgb(203, 0, 0)";
                ctx.fillRect(x * w, y * w, w, w);
                ctx.drawImage(labanObj, x * w, y * w, w, w);
            }
        }
    }
}

function updateNephiObj(item){
    if (!nephiCondition.sword && !nephiCondition.plate) {
        if(item === "sword"){
            nephiCondition.sword = true;
            currentNephi = nephiObjSword;
        } else if(item === "plate"){
            nephiCondition.plate = true;
            currentNephi = nephiObjPlate;
        }  
    } else if (nephiCondition.sword && !nephiCondition.plate) {
        if(item === "plate"){
            nephiCondition.plate = true;
            currentNephi = nephiObjBoth;
        }
    } else if (nephiCondition.plate && !nephiCondition.sword) {
        if(item === "sword"){
            nephiCondition.sword = true;
            currentNephi = nephiObjBoth;
        }
    }
}

function checkCollision(currentGridX, currentGridY, nextGritX, nextGritY) {
    let nextGrit = gBoard[nextGritY][nextGritX];
    gBoard[currentGridY][currentGridX] = 0;
    if (nextGrit == 0) {
        gBoard[nextGritY][nextGritX] = 1;
        updateNephiObj("");
    } else if (nextGrit == 2){
        gBoard[nextGritY][nextGritX] = 1;
        updateNephiObj("sword");
    } else if (nextGrit == 3){
        gBoard[nextGritY][nextGritX] = 1;
        updateNephiObj("plate");
    } else if (nextGrit == 4){
        if (nephiCondition.sword && nephiCondition.plate) {
            alert("You have defeated Laban!");
            reset = true;
        } else {
            alert("You need the sword and plate to defeat Laban!");
            gameOver = true; 
            showMessage("Game Over!");

        }
    } else {
        gBoard[currentGridY][currentGridX] = 1;
        alert("You can't go there!");
    }

}

document.addEventListener("keydown", function(event) {
    let currentGridX = nephiCondition.x;
    let currentGridY = nephiCondition.y;
    let nextGritX = currentGridX;
    let nextGritY = currentGridY;

    switch (event.key) {
        case "ArrowUp":
            nextGritY--;
            break;
        case "ArrowDown":
            nextGritY++;
            break;
        case "ArrowLeft":
            nextGritX--;
            break;
        case "ArrowRight":
            nextGritX++;
            break;
        default:
            return; // Ignore other keys
    }

    // Check if the new position is within bounds
    if (nextGritX >= 0 && nextGritX < 8 && nextGritY >= 0 && nextGritY < 8) {
        console.log("Current Position: (" + currentGridX + ", " + currentGridY + ")");
        checkCollision(currentGridX, currentGridY, nextGritX, nextGritY);
        if (gameOver) return;
        nephiCondition.x = nextGritX;
        nephiCondition.y = nextGritY;
        draw(); // Redraw only after a valid move
    }

    if (reset) {
        resetGame();
    }
});

resetButton.addEventListener("click", function() {
    resetGame();
});

function resetGame() {
    gBoard = initialBoard.map(row => row.slice());
    nephiCondition = {
        x: 1,
        y: 1,
        sword : false,
        plate : false
    }
    currentNephi = nephiObj;
    reset = false;
    gameOver = false; 
    draw();
}

function showMessage(message) {
    ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillRect(0, 0, gameBoard.width, gameBoard.height);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(message, width / 2, height / 2);
}

