const mainBody = document.querySelector("body");
const mainContainer = document.getElementById("main-container");
const sketchBoard = document.getElementById("sketch-board");
const changeSizeBtn = document.getElementById("change-size-btn");
const divPrompt = document.createElement("div");

const drawModeBtn = document.getElementById("draw-mode-btn");
const eraseToolButton = document.getElementById("erase-tool-btn");
const blackBrushButton = document.getElementById("black-brush-btn");
const rainbowBrushButton = document.getElementById("rainbow-brush-btn");
const clearButton = document.getElementById("clear-btn");

const boardSize = 860;
let N = 16;
let isDrawMode = false;
let defaultBlack = true;
let isRainbowMode = false;
let isCustomColor = false;
let isEraseMode = false;
let isMouseDown = false;

//Function to create the sketch board
function createPixelForBoard(X) {
    let pixelSize = boardSize / X;
    for (let i = 0; i < X * X; i++){
        
        const canvasPixel = document.createElement("div");
        canvasPixel.setAttribute("id", "pixel");
        canvasPixel.setAttribute(`style`,
            `
            width: ${pixelSize}px;
            height: ${pixelSize}px;
            `)
        sketchBoard.appendChild(canvasPixel);
    }
    console.log(`Created a board with ${X}`);
    colorOverPixel();
}

createPixelForBoard(N);

//Custom Prompt I made: Since you cant directly style the alert method 
changeSizeBtn.addEventListener("click", () => {
    changeSizePrompt();
});

function changeSizePrompt() {
    mainContainer.setAttribute(`style`, `
        filter: blur(5px);
        `)
    divPrompt.insertAdjacentHTML("beforeend", `
        <p id="text-prompt">Enter number of Pixels</p>
        <input id="input-prompt" type="number" required />
        <button id="btn-prompt" type="submit">Done</button>
        <p id="error-prompt"></p>
        `);
    mainBody.appendChild(divPrompt);
    stylePrompt(divPrompt);

    const inputPrompt = document.getElementById("input-prompt");
    const buttonPrompt = document.getElementById("btn-prompt");
    
    buttonPrompt.addEventListener("click", () => {
        let inputNum = parseInt(inputPrompt.value);
        if (inputNum && 0 < inputNum && inputNum <= 100) {
            console.log(inputNum);
            mainContainer.setAttribute(`style`, `
                filter: none;
            `)
            divPrompt.textContent = "";
            mainBody.removeChild(divPrompt);
            removePixel();
            createPixelForBoard(inputNum);
        } else {
            errorInputSize(inputNum);
        }
    }); 
}

function stylePrompt(mainDiv) {
    const textPrompt = document.getElementById("text-prompt");
    const inputPrompt = document.getElementById("input-prompt");
    const buttonPrompt = document.getElementById("btn-prompt");
    mainDiv.setAttribute(`style`, `
            display: flex;
            flex-direction: column;
            justify-items: center;
            flex-wrap: wrap;
            position: absolute;
            z-index: 6;
            width: 25rem;
            height: 22rem;
            background-color: gray;
            padding: 10px;
            align-items: center;
        `);
    textPrompt.setAttribute(`style`, `
            width: 100%;
            height: 3rem;
            text-align: center;
        `);
    inputPrompt.setAttribute(`style`, `
            height: 2rem;
        `);
    buttonPrompt.setAttribute(`style`, `
        
        `);
}

function errorInputSize(inputNum) {
    const inputPrompt = document.getElementById("input-prompt");
    const errorPrompt = document.getElementById("error-prompt")
    inputPrompt.style.border = "2px solid red";
    
    if (inputNum <= 0) {
        errorPrompt.textContent = "Please enter a greater number";
    } else if (inputNum >= 100) {
        errorPrompt.textContent = "Maximum number of pixels reached (100px)";
    } else {
        errorPrompt.textContent = "Please enter an number";
    }
}


function removePixel() {
    const pixelBit = document.querySelectorAll("#pixel");
    pixelBit.forEach((div) => {
        sketchBoard.removeChild(div);
    })
}


//Code for adding pixel behaviour: Adding and removing
function colorOverPixel() {
    const pixelBit = document.querySelectorAll("#pixel");
    

    pixelBit.forEach((div) => {
        div.addEventListener("mouseover", () => {
            let pixelOpacity = 0.0;
            if (isMouseDown) {
                div.style.backgroundColor = setColor();
            } else if (isDrawMode == false) {
                div.style.backgroundColor = setColor();
            }
        });
        div.addEventListener("dragstart", (event) => { 
            event.preventDefault();
        });
    });
}

function clearPixelColor() {
    const pixelBit = document.querySelectorAll("#pixel");

    pixelBit.forEach((div) => {
        div.style.backgroundColor = "";
    });
}

// Code for Draw mode - Click and drag to draw

drawModeBtn.addEventListener("click", () => { 
    if (!isDrawMode) {
        isDrawMode = true;
    } else {
        isDrawMode = false;
    }
    console.log(`Draw mode is ${isDrawMode}`);
});

sketchBoard.addEventListener(`mousedown`, function () {
    isMouseDown = true;
    colorOverPixel();
});

document.addEventListener(`mouseup`, function () {
    isMouseDown = false;
});

//Tests Go Below This Code

const brushColorPick = document.getElementById("brushcolor");

eraseToolButton.addEventListener("click", () => { 
    isEraseMode = true;
    defaultBlack = false;
    isRainbowMode = false;
    isCustomColor = false;
    console.log(`Erase Tool On`);
});

blackBrushButton.addEventListener("click", () => { 
    isEraseMode = false;
    defaultBlack = true;
    isRainbowMode = false;
    isCustomColor = false;
    console.log(`Black Brush On`);
});

rainbowBrushButton.addEventListener("click", () => {
    isEraseMode = false;
    defaultBlack = false;
    isRainbowMode = true;
    isCustomColor = false;
    console.log(`Rainbow Mode On`);
});

brushColorPick.addEventListener("change", () => {
    isEraseMode = false;
    defaultBlack = false;
    isRainbowMode = false;
    isCustomColor = true;
    console.log(`User Custom Color`);
});

clearButton.addEventListener("click", () => { 
    clearPixelColor();
});

//Test Function Go Here:
function setColor() {
    let colorPicked = "";

    if (defaultBlack) {
        return colorPicked = "#151515";
    }
    else if (isRainbowMode) {
        return colorPicked = `rgb(${randomColor() + 50}, ${randomColor() + 50}, ${randomColor() + 50})`;
    }
    else if (isEraseMode) {
        return colorPicked = "";
    }
    else { 
        return brushColorPick.value;
    }
}

function randomColor() {
    let randomNum = Math.floor(Math.random() * 200);
    console.log(randomNum);
    return randomNum;
}