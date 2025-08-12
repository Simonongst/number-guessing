const randomNums = [];

let bestTime = null;
let controlState = false;
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;
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

function initGame(){
    for(let i = 0; i < row; i++){
        for(let j = 0; j < col; j++){
            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('name', 'guess');
            input.setAttribute('maxlength', '1');
            input.setAttribute('class', 'tile');
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

    directionEl.innerHTML = '';
    directionEl.style.marginTop = '0';
};

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