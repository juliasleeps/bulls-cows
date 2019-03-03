const regExp = /^\d{4}$/;
const maxTopTableSize = 3;
const hiddenNumSize = 4;
const message = 'Congrats! You go to Top Result :) Enter you name'
let hiddenNum = [];
let userGuess = null;
let bulls = null;
let cows = null;
let attempts = 0;
let topResults = [];
let userInput = document.getElementById('input');
let resultTable = document.getElementById('table').getElementsByTagName('tbody')[0];
let winMessage = document.getElementById('win');
let resetButton = document.getElementById('reset');
let topTable = document.getElementById('top');
let inputDiv = document.getElementById('inputdiv');

createHiddentNumber();
getFromLocalStorage();

userInput.addEventListener('change', function(e){
    e.preventDefault();
    userGuess = validateInput(this.value);
    if(userGuess){
        attempts++;
        checkGuess(userGuess);
        addRow(attempts, this.value, bulls, cows);
        checkWin();
    }
    this.value = '';
});

resetButton.addEventListener('click', function(){
    hiddenNum = [];    
    attempts = 0;
    createHiddentNumber();
    clearTable();
    winMessage.innerHTML = '';
    inputDiv.style.display = 'block';
});

function addRow(att, val, bulls, cows){
    let row = resultTable.insertRow();
    row.insertCell().innerHTML = att;
    row.insertCell().innerHTML = val;
    row.insertCell().innerHTML = bulls;
    row.insertCell().innerHTML = cows;
};

function clearTable(){
    while(resultTable.hasChildNodes()){
        resultTable.deleteRow(0);
    }
};

function createHiddentNumber(){
    // make a random 4-digit secret number. The digits must be all different 
    while(hiddenNum.length < hiddenNumSize){
    let item = Math.floor(Math.random() * 10);
    if (hiddenNum.indexOf(item) === -1) {
        hiddenNum.push(item);   
      }
    }   
};

function validateInput(input){
    let validInput = null;
    let duplicates = [];  
    if (regExp.test(input)){
        input = input.split('').map(function(item){
            return parseInt(item);
        });
        duplicates = input.filter(function(a){
            return input.indexOf(a) !== input.lastIndexOf(a)
        });
        if (duplicates.length === 0) {
            validInput = input;
        } 
    }
    return validInput;
};

function checkGuess(guess){
    bulls = 0;
    cows = 0;
    for (let i = 0; i < hiddenNum.length; i++){
            if (hiddenNum[i] === guess[i]){
                bulls++;
            }
        }
    for (let i = 0; i < hiddenNum.length; i++){
        for (let j = 0; j < guess.length; j++){
            if (hiddenNum[i] === guess[j]){
                cows++;
            }
        }
    }
    cows = cows - bulls;
};

function checkWin(){
    if(bulls === hiddenNumSize){
        congrats();
        saveTopResult(attempts);
        fillTopTable();  
    }
};

function congrats(){
    resultTable.lastChild.style.backgroundColor = 'lightgreen';
    winMessage.innerHTML = `You did it! It took you ${attempts} ${attempts > 1 ? `attempts` : `attempt`} <br> Secret number is ${hiddenNum.join('')}`;
    inputDiv.style.display = 'none';
};

function compareResult(objA, objB) {
    return objA.attempts - objB.attempts;
};

function saveTopResult(att){
    if (topResults.length < maxTopTableSize){
        let result = {name: prompt(message) || 'Anonym', attempts: att};
        topResults.push(result);
        topResults.sort(compareResult); 
        saveToLocalStorage();   
    } else {
        for (let i = 0; i < topResults.length; i++){
            if (att < topResults[i].attempts){  
                for(let j = topResults.length - 1; j > i; j--){
                    topResults[j] = topResults[j - 1];
                }
                let result = {name: prompt(message) || 'Anonym', attempts: att};
                topResults[i] = result;
                saveToLocalStorage();
                break;    
            }
        }
    } 
};

function fillTopTable(){
    for(let i = 0; i < topResults.length; i++){
        topTable.children[i].innerHTML = `${i + 1}. Name: ${topResults[i].name}, Attempts: ${topResults[i].attempts}`;
    }
};

function saveToLocalStorage(){
    var str = JSON.stringify(topResults);
    localStorage.setItem('topResults', str);
};

function getFromLocalStorage(){
    var str = localStorage.getItem('topResults');
    topResults = JSON.parse(str);
    if (!topResults){
        topResults = [];
    }
    fillTopTable(); 
};