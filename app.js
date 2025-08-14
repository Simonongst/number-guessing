const randomNums = []; // Stores randomly generated numbers

let bestTime = null; // Tracks the shortest time taken to win
let controlState = false; // Check game initialize

// Timer
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

// Game grid dimensions
let row = 5;
let col = 3;

const controlBtnEl = document.querySelector('#control');
const checkBtnEl = document.querySelectorAll('.check');

const timerEl = document.querySelector('#timer');
const randomNumEl = document.querySelectorAll('.randomNum');
const section2El = document.querySelector('#section-2');
const messageEl = document.querySelector('#message');
const resultEl = document.querySelector('.result');
const directionEl = document.querySelector('#direction');

// Creates input fields and "Check" buttons for each row dynamically
function initGame(){
    for(let i = 0; i < row; i++){
        for(let j = 0; j < col; j++){
            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('name', 'guess');
            input.setAttribute('maxlength', '1');
            input.setAttribute('class', 'tile');
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('inputmode', 'numeric');
            input.dataset.row = i;
            section2El.appendChild(input);
        };
        const checkBtn = document.createElement('button');
        checkBtn.setAttribute('class', 'tile check');
        checkBtn.textContent = 'Check';
        checkBtn.dataset.row = i;
        checkBtn.addEventListener('click', checkInput);
        section2El.appendChild(checkBtn);
    };

    // Clear direction text and reset margin
    directionEl.innerHTML = '';
    directionEl.style.marginTop = '0';
};

// Handles start/restart button
function control() {
    if (!controlState) {
        initGame();
        controlState = true;
    } else {
        reset();
    }

    start();
    controlBtnEl.textContent = 'Restart';
    generateRandomNum();
    inputControl();
}

// Generates unique number between 0-9 for each tile, no duplication
function generateRandomNum(){
    randomNums.length = 0;

    for (let i = 0; i < col; i++) {
        let num = Math.floor(Math.random() * 10);
        let isDuplicate = false;

        for (let j = 0; j < i; j++) {
            if (randomNums[j] === num) {
                isDuplicate = true;
                break;
            }
        }

        if (isDuplicate) {
            i--;
        } else {
            randomNums[i] = num;
        }
    }
};

// Reveal the numbers after win/loss
function revealRandomNumber(){
  for (let i = 0; i < 3; i++) {
    randomNumEl[i].textContent = randomNums[i];
  };
};

// Enables/disables input fields and buttons based on current game state
function inputControl(){
    const inputFields = section2El.querySelectorAll('input');
    const checkButtons = section2El.querySelectorAll('button');
    inputFields.forEach((input, index) => {
        if(index < 3){
            input.disabled = false;
            checkButtons.forEach((button, index) => {
                if(index < 1){
                    button.disabled = false;
                    button.style.backgroundColor = 'hsl(128, 100%, 40%)';
                } else {
                    button.disabled = true;
                    button.style.pointerEvents = 'none';
                };
            });
        } else {
            input.disabled = true;
            input.style.backgroundColor = 'hsl(0, 0%, 50%)';
        };
    });
};

// Validates user input. Checks for correctness and provides colour feedback
function checkInput(e) {
    const clickedRow = e.target.dataset.row;
    const inputsInRow = section2El.querySelectorAll(`input[data-row="${clickedRow}"]`);

    let allFilled = true;
    const guesses = [];

    inputsInRow.forEach((input, index) => {
        const value = input.value.trim();
        const guess = parseInt(value);
        if (value === '' || isNaN(guess)) {
            allFilled = false;
            messageEl.classList.remove('win', 'lose');
            messageEl.classList.add('invalid');
            messageEl.textContent = 'Input a number between 0-9!';
            input.style.borderColor = 'hsl(29, 100%, 40%)';
        } else {
            input.style.borderColor = 'hsl(0, 0%, 50%)';
            guesses.push(guess);

            if (guess === randomNums[index]) {
                input.style.backgroundColor = 'hsl(120, 100%, 40%)';
            } else if (randomNums.includes(guess)) {
                input.style.backgroundColor = 'hsl(29, 100%, 40%)';
            } else {
                input.style.backgroundColor = 'hsl(4, 100%, 40%)';
            }
        }
    });

    if (allFilled) {
        messageEl.textContent = '';
        messageEl.classList.remove('invalid');
    }

    if (!allFilled) return;

    const isCorrect = guesses.every((num, i) => num === randomNums[i]);

    if (isCorrect) {
        stop();
        revealRandomNumber();     
        messageEl.classList.remove('lose', 'invalid');
        messageEl.classList.add('win');
        messageEl.textContent = 'Victory! You guessed them all right!';
        
        const finalTime = elapsedTime;

        if (bestTime === null || finalTime < bestTime) {
            bestTime = finalTime;
            resultEl.textContent = formatTime(bestTime);
        }
        
    } else {
        const nextRow = parseInt(clickedRow) + 1;

        if (nextRow >= row) {
            stop();
            revealRandomNumber();
            messageEl.classList.remove('win', 'invalid');
            messageEl.classList.add('lose');
            messageEl.textContent = 'Game Over! Better luck next time.';
            return;
        }

        inputsInRow.forEach(input => {
            input.disabled = true;
        });

        e.target.disabled = true;
        e.target.style.pointerEvents = 'none';
        e.target.style.backgroundColor = 'hsl(0, 0%, 50%)';

        const nextInputs = section2El.querySelectorAll(`input[data-row="${nextRow}"]`);
        const nextButton = section2El.querySelector(`button[data-row="${nextRow}"]`);

        nextInputs.forEach(input => {
            input.disabled = false;
            input.style.backgroundColor = 'hsl(0, 0%, 0%)';
        });

        if (nextButton) {
            nextButton.disabled = false;
            nextButton.style.pointerEvents = 'auto';
            nextButton.style.backgroundColor = 'hsl(128, 100%, 40%)';
        }
    }
}

// Start timer
function start(){
    if(!isRunning){
        startTime = Date.now() - elapsedTime;
        timer = setInterval(update, 10);
        isRunning = true;
    };
};

// Stop timer. Record elapsed time
function stop(){
    if(isRunning){
        clearInterval(timer);
        elapsedTime = Date.now() - startTime;
        isRunning = false;
    }
};

// Reset timer and elements to start a fresh game
function reset(){
    clearInterval(timer);
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;

    messageEl.textContent = "";
    messageEl.classList.remove('win', 'lose', 'invalid');
    timerEl.textContent = "00:00";

    randomNumEl.forEach(el => {
        el.textContent = '?';
    });

    const inputFields = section2El.querySelectorAll('input');
    const checkButtons = section2El.querySelectorAll('button');

    inputFields.forEach((input, index) => {
        input.value = '';
        if(index < 3){
            input.disabled = false;
            input.style.backgroundColor = 'hsl(0, 0%, 0%)';
        } else {
            input.disabled = true;
            input.style.backgroundColor = 'hsl(0, 0%, 50%)';
        }
    });

    checkButtons.forEach((button, index) => {
        if(index < 1){
            button.disabled = false;
            button.style.backgroundColor = 'hsl(128, 100%, 40%)';
            button.style.pointerEvents = 'auto';
        } else {
            button.disabled = true;
            button.style.pointerEvents = 'none';
            button.style.backgroundColor = 'hsl(0, 0%, 50%)';
        }
    });
};

// Update timer
function update(){
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    
    let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
    let seconds = Math.floor(elapsedTime / 1000 % 60);

    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    timerEl.textContent = `${minutes}:${seconds}`;
};

// Format time in MM:SS format
function formatTime(time) {
    let minutes = Math.floor(time / (1000 * 60) % 60);
    let seconds = Math.floor(time / 1000 % 60);

    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    return `${minutes}:${seconds}`;
};

// Start/restart the game when control button is clicked
controlBtnEl.addEventListener('click', control);