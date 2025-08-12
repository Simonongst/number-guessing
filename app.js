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