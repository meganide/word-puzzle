// ********************************** VARIABLES **********************************

const WORDS = [
  {
    message: 'Raise FOUR to FIVE',
    startWord: 'FOUR',
    endWord: 'FIVE',
  },
  {
    message: 'Cover EYE with LID',
    startWord: 'EYE',
    endWord: 'LID',
  },
  {
    message: 'Crown TIGER with ROSES',
    startWord: 'TIGER',
    endWord: 'ROSES',
  },
  {
    message: 'Make WHEAT into BREAD',
    startWord: 'WHEAT',
    endWord: 'BREAD',
  },
];

let currentWordObject;
let prevWord;

// ********************************** FUNCTIONS **********************************

function clearWordList() {
  const wordList = document.querySelector('#word-list');
  while (wordList.lastElementChild) {
    wordList.removeChild(wordList.lastElementChild);
  }
}

function removeAllInputs() {
  const allInputs = document.querySelectorAll('input');
  allInputs.forEach((input) => {
    input.remove();
  });
}

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  const randomWord = WORDS.splice(randomIndex, 1);
  currentWordObject = randomWord[0];
  prevWord = currentWordObject.startWord;
}

function createTextInputs(currentWordObject) {
  const inputsWrapper = document.querySelector('.inputs');
  const messageElement = document.querySelector('#message');
  messageElement.innerHTML = currentWordObject.message;

  for (const char of currentWordObject.startWord) {
    const textInputElement = document.createElement('input');
    textInputElement.setAttribute('type', 'text');
    textInputElement.setAttribute('maxlength', '1');
    textInputElement.setAttribute('onClick', 'this.select()');
    textInputElement.value = char;
    inputsWrapper.append(textInputElement);
  }
}

function addWordToWordList(word) {
  const wordList = document.querySelector('#word-list');
  const li = document.createElement('li');
  li.innerHTML = word;
  wordList.append(li);
}

function InputOnChange() {
  document.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', updateChar);
  });
}

function getNewWord() {
  clearWordList();
  removeAllInputs();
  getRandomWord();
  createTextInputs(currentWordObject);
  addWordToWordList(currentWordObject.startWord);
  InputOnChange();
}

function makeReadOnly() {
  let word = '';

  document.querySelectorAll('input').forEach((input) => {
    input.setAttribute('readonly', 'readonly');
    word += input.value.toUpperCase();
  });

  return word;
}

function removeReadOnly() {
  document.querySelectorAll('input').forEach((input) => {
    input.removeAttribute('readonly', 'readonly');
  });
}

async function checkWord(word) {
  const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
  try {
    const response = await fetch(`${BASE_URL}${word}`);
    return response.status;
  } catch (err) {
    console.log('not valid word');
  }
}

function toggleError(message = '') {
  const errorElement = document.querySelector('#error');
  errorElement.innerHTML = message;
}

function revertToOldWord(newWord) {
  document.querySelectorAll('input').forEach((input, index) => {
    input.value = newWord[index];
  });
}

function checkIfWin(currentWord) {
  if (currentWord === currentWordObject.endWord) {
    alert('GOOD JOB! Click OK to get a new word!');
    getNewWord();
  }
}

async function updateChar(e) {
  // allow only letters in input fields
  e.target.value = e.target.value.replace(/[^A-Za-z]/g, '').replace(/(\..*)\./g, '$1');

  // if input field not empty
  if (e.target.value !== '') {
    // input read only while we wait for api
    let newWord = makeReadOnly();

    // Check if word is legit with api call
    const status = await checkWord(newWord);

    // if word is legit, keep it and store in word List (progress)
    if (status === 200 && newWord !== currentWordObject.startWord) {
      toggleError();
      addWordToWordList(newWord);
      prevWord = newWord;
      checkIfWin(newWord);
    } else {
      toggleError(`${newWord} is not a valid word, try again!`);
      revertToOldWord(prevWord);
    }

    removeReadOnly();
  }
}

// ********************************** FUNCTION CALLS **********************************

getNewWord();

// Disable backspace, delete, space keys
document.addEventListener('keydown', (e) => {
  if (e.code === 'Backspace' || e.code === 'Delete' || e.code === 'Space') {
    e.preventDefault();
  }
});
