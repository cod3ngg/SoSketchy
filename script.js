const mainBody = document.querySelector("body");
const mainContainer = document.getElementById("main-container");
const sketchBoard = document.getElementById("sketch-board");
const changeSizeBtn = document.getElementById("change-size-btn");
const divPrompt = document.createElement("div");

const boardSize = 860;
let N = 16;
let isMouseDown = false;
let isDrawMode = false;

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
        if (inputNum && 0 < inputNum && inputNum < 100) {
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

//Code for adding pixel behaviour: Adding and removing
function colorOverPixel() {
    const pixelBit = document.querySelectorAll("#pixel");

    pixelBit.forEach((div) => {
        div.addEventListener("mouseover", () => {
            if (isMouseDown) {
                div.style.backgroundColor = "red";
            } else if (isDrawMode == false) {
                div.style.backgroundColor = "red";
            }
        });
        div.addEventListener("dragstart", (event) => { 
            event.preventDefault();
        });
    });
}

function removePixel() {
    const pixelBit = document.querySelectorAll("#pixel");
    pixelBit.forEach((div) => {
        sketchBoard.removeChild(div);
    })
}

// Code for Draw mode - Click and drag to draw
if (isDrawMode) {
    sketchBoard.addEventListener(`mousedown`, function () {
        isMouseDown = true;
        colorOverPixel();
    });


    document.addEventListener(`mouseup`, function () {
        isMouseDown = false;
    });
}
