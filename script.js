const mainBody = document.querySelector("body");
const mainContainer = document.getElementById("main-container");
const sketchControls = document.getElementById("sketch-controls")
const sketchBoard = document.getElementById("sketch-board");
const divPrompt = document.createElement("div");

const buttonAll = document.querySelectorAll("button");
const changeSizeBtn = document.getElementById("change-size-btn");
const drawModeBtn = document.getElementById("draw-mode-btn");
const eraseToolButton = document.getElementById("erase-tool-btn");
const blackBrushButton = document.getElementById("black-brush-btn");
const rainbowBrushButton = document.getElementById("rainbow-brush-btn");
const brushColorPick = document.getElementById("brushcolor");
const clearButton = document.getElementById("clear-btn");
const sliderErase = document.getElementById("slider-erase");

const boardSize = 80;
let N = 16;
let isDrawMode = false;
let defaultBlack = true;
let isRainbowMode = false;
let isCustomColor = false;
let isEraseMode = false;
let isMouseDown = false;
let clearState = false;
let slideEraseState = false;
let col = 1;

//Function to create the sketch board
function createPixelForBoard(X) {
    let pixelSize = boardSize / X;
    N = X;
    for (let j = 1; j <= X; j++){
        for (let i = 1; i <= X; i++) {
            const canvasPixel = document.createElement("div");
            canvasPixel.setAttribute("id", `pixel`);
            canvasPixel.classList.add(`pixel-${i}`)
            canvasPixel.setAttribute(`style`,
            `
            width: ${pixelSize}vw;
            height: ${pixelSize}vw;
            `)
            sketchBoard.appendChild(canvasPixel);
        }
    }
    console.log(`Created a board with ${X}`);
    pixelSize = boardSize / N;
    colorOverPixel();
    createSliderEraser(X);
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
        <span id="x-row"><i id="x-close" class="fa-solid fa-x"></i></span>
        <p id="text-prompt">Enter number of Pixels</p>
        <input class="default-color" id="input-prompt" type="number" placeholder="1-100px" required/>
        <button id="btn-prompt" type="submit">Done</button>
        <p id="error-prompt"></p>
        `);
    mainBody.appendChild(divPrompt);
    stylePrompt(divPrompt);
    divPrompt.classList.add("mb-prompt");

    const inputPrompt = document.getElementById("input-prompt");
    const buttonPrompt = document.getElementById("btn-prompt");
    const closeBtn = document.getElementById("x-close");
    
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

    divPrompt.addEventListener("keydown", (event) => {
        if (event.key === 'Enter') {
            buttonPrompt.click();
        } else if (event.key === 'Escape') {
            closeBtn.click();
        }

    });

    buttonPrompt.addEventListener("mouseover", () => { 
        buttonPrompt.style.backgroundColor = "#1aa5f0";
    });
    buttonPrompt.addEventListener("mouseout", () => { 

        buttonPrompt.style.backgroundColor = "#118fc9";
    });

    closeBtn.addEventListener("mouseover", () => {
        closeBtn.setAttribute(`style`, `
            color: #118fc9;
            cursor: pointer;
        `);
        closeBtn.addEventListener("click", () => {
            divPrompt.textContent = "";
            mainBody.removeChild(divPrompt);
            mainContainer.setAttribute(`style`, `
                filter: none;
            `)
        });
    });
    closeBtn.addEventListener("mouseout", () => { 
        closeBtn.setAttribute(`style`, `
            color: ;
        `);
    });
}

function stylePrompt(mainDiv) {
    const textPrompt = document.getElementById("text-prompt");
    const inputPrompt = document.getElementById("input-prompt");
    const buttonPrompt = document.getElementById("btn-prompt");
    const closeRow = document.getElementById("x-row");
    mainDiv.setAttribute(`style`, `
            width: 25rem;
            height: 22rem;
            display: flex;
            position: fixed;
            flex-direction: column;
            justify-items: center;
            align-items: center;
            flex-wrap: wrap;
            background-color: #CFCFCF;
            margin: 25vh auto;
            padding: 8px;
            z-index: 6;
            border-radius: 15px;
            box-shadow: 0px 0px 8px 3px #AAAAAA;
        `);
    
    closeRow.setAttribute(`style`, ` 
            width: 22rem;
            display: flex;
            justify-content: flex-end;
            margin-top: .7rem;
        `); 
    textPrompt.setAttribute(`style`, `
            width: 100%;
            height: 3rem;
            color: #116ac8;
            font-size: 1.3rem;
            font-weight: 600;
            text-align: center;
            margin-top: 4rem;
        `);
    inputPrompt.setAttribute(`style`, `
            -webkit-appearance: none;
            height: 2rem;
            font-family: Manrope, sans-serif;
            font-weight: 500;
            color: #1a1a1a;
            font-size: 1rem;
            text-align: center;
            border: none;
        `);
    buttonPrompt.setAttribute(`style`, `
            height: 30px;
            width: 85px;
            background-color: #118fc9;
            color: #f1f1f1;
            font-family: Manrope, sans-serif;
            font-weight: 900;
            font-size: 1.1vw;
            word-wrap: wrap;
            border-radius: 7px;
            border: none;
            margin-top: 1rem;
        `);
    inputPrompt.focus();
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
        let pixelOpacity = 0.0;
        div.addEventListener("mouseover", () => {
            if (isMouseDown && isDrawMode) {
                if (defaultBlack) {
                    pixelOpacity += 0.1;
                }
                div.style.backgroundColor = setColor(pixelOpacity);
            } else if (isDrawMode == false) {
                if (defaultBlack) {
                    pixelOpacity += 0.1;
                }
                div.style.backgroundColor = setColor(pixelOpacity);
            }
        });

        div.addEventListener("dragstart", function (event) { 
            event.preventDefault();
        });

        document.addEventListener(`mousedown`, function () {
            isMouseDown = true;
        });

        document.addEventListener(`mouseup`, function () {
            isMouseDown = false;
        });

        clearButton.addEventListener("click", () => { 
            div.style.backgroundColor = "";
            pixelOpacity = 0.0;
        });

        sliderErase.addEventListener("input", () => { 
                pixelOpacity = 0.0;
        });
    });
}

function setColor(objectOpacity) {
    let colorPicked = "";

    if (defaultBlack) {
        return colorPicked = `rgba(15, 15, 15, ${objectOpacity})`;
    }
    else if (isRainbowMode) {
        return colorPicked = `rgb(${randomColor() + 30}, ${randomColor() + 30}, ${randomColor() + 30})`;
    }
    else if (isEraseMode) {
        return colorPicked;
    }
    else { 
        return brushColorPick.value;
    }
}

function randomColor() {
    let randomNum = Math.floor(Math.random() * 180);
    console.log(randomNum);
    return randomNum;
}

function createSliderEraser(inputNumSize) {
    let pixelSize = boardSize / inputNumSize;
    let pixelMax = pixelSize;
    let pixelMin = 0;

    sliderErase.addEventListener("input", () => {
        let sliderValue = sliderErase.value;

        if (sliderValue > pixelMin && sliderValue < pixelMax) {
            eraseColumn(col);
            pixelMin = pixelMax;
            pixelMax = pixelSize * col;
            console.log(`Erased col: ${col}`);
            console.log(pixelMax);
        } else if (sliderValue == 0 || sliderValue == 80) {
            pixelMax = pixelSize;
            pixelMin = 0;
            col = 1;
        } else {
            console.log(`No columns erased`)
        }

    
    });
}

function eraseColumn(x) {
    let pixelCol = document.querySelectorAll(`.pixel-${x}`);
    pixelCol.forEach((div) => {
        div.style.backgroundColor = "rgba(241, 241, 241, 0.0)";
    });

    col = col + 1;
}

buttonAll.forEach((button) => {
    button.addEventListener("mousedown", () => {
        button.setAttribute(`style`, `
                background-color: #118fc9;
                color: #f1f1f1;
            `);
    });
    document.addEventListener("mouseup", () => {
        button.setAttribute(`style`, `
            background-color: "";
            color: "";
        `);
        
        if (isDrawMode) {
            drawModeBtn.setAttribute(`style`, `
                background-color: #118fc9;
                color: #f1f1f1;
            `);
        }
        
        if (isEraseMode) {
            eraseToolButton.setAttribute(`style`, `
                background-color: #118fc9;
                color: #f1f1f1;
            `);
        } else if (defaultBlack) {
            blackBrushButton.setAttribute(`style`, `
                background-color: #118fc9;
                color: #f1f1f1;
            `);
        } else if (isRainbowMode) {
            rainbowBrushButton.setAttribute(`style`, `
                background-color: #118fc9;
                color: #f1f1f1;
            `);
        }
    });
});

if (defaultBlack) {
    blackBrushButton.setAttribute(`style`, `
        background-color: #118fc9;
        color: #f1f1f1;
    `);
}


// Code for Draw mode - Click and drag to draw

drawModeBtn.addEventListener("mouseup", () => { 
    if (!isDrawMode) {
        isDrawMode = true;
    } else {
        isDrawMode = false;
    }
    console.log(`Draw mode is ${isDrawMode}`);
});

eraseToolButton.addEventListener("mouseup", () => { 
    isEraseMode = true;
    defaultBlack = false;
    isRainbowMode = false;
    isCustomColor = false;
    console.log(`Erase Tool On`);
});

blackBrushButton.addEventListener("mouseup", () => { 
    isEraseMode = false;
    defaultBlack = true;
    isRainbowMode = false;
    isCustomColor = false;
    console.log(`Black Brush On`);
});

rainbowBrushButton.addEventListener("mouseup", () => {
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
    if (isCustomColor) {
            brushColorPick.setAttribute(`style`, `
                background-color: #118fc9;
                color: #f1f1f1;
            `);
    }
});

sketchControls.addEventListener("mouseup", () => { 
    if (isCustomColor === false) {
        brushColorPick.setAttribute(`style`, `
            background-color: "";
            color: "";
        `);
    }
});

//Tests Go Below This Code

//For Touch Screen Drag

//Test Function Go Here: