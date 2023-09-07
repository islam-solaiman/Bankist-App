'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-05-27T17:01:17.194Z',
    '2023-07-11T23:36:17.929Z',
    '2023-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-06-25T18:49:59.371Z',
    '2023-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


// Function Format Movemnets Date

const formatMovementsDate = function(date){
  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth()}`.padStart(2, 0);
  const year = date.getFullYear();
  
  const calcDayPassed = (date1, date2) => Math.round
  (Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));
  const dayPassed = calcDayPassed(new Date(), date)
  console.log(dayPassed)
  if (dayPassed === 0) return 'Today'
  if (dayPassed === 1) return 'Yeasterday'
  if (dayPassed <= 7) return`${dayPassed} Days Ago`
  else {
    return `${day}/${month}/${year}`;
  }
}

// Function Displays The Account Movemnets

const displayMovements = function (acc, sort = false) {

  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function(mov, i){

    const type = mov > 0 ? 'deposit' : 'withdrawal'; 
    
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${mov.toFixed(2)}$</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

// Function Calculates An Displays The Account Balance

const callDisplayBalance = function(acc){
  acc.balance = acc.movements
  .reduce((acc, mov) => acc + mov);
  labelBalance.textContent = `${acc.balance.toFixed(2)}$`;
}

// Function Creats User Name

const createUserName = function(accs){
  accs.forEach(function(acc){
  acc.username = acc.owner
  .toLowerCase()
  .split(' ')
  .map((name) => name[0])
  .join('');
});
};
createUserName(accounts);

// Function Calculates The Account Summery

const calcDisplaySummary = function(acc){ 
  const incomes = acc.movements
  .filter((mov) => mov > 0)
  .reduce((acc, curr) => acc + curr);
  labelSumIn.textContent = `${incomes.toFixed(2)}$`;

  const outes = acc.movements
  .filter((mov) => mov < 0)
  .reduce((acc, curr) => acc + curr);
  labelSumOut.textContent = `${Math.abs(outes.toFixed(2))}$`

  const interest = acc.movements
  .filter((mov) => mov > 0)
  .map((deposit) => deposit * acc.interestRate/100)
  .filter((interest) => interest >= 1)
  .reduce((acc, curr) => acc + curr);
  labelSumInterest.textContent = `${interest.toFixed(2)}$`
}

const updateUi = function(acc){
      // Display M
      displayMovements(acc);
      // Display Balance 
      callDisplayBalance(acc);
      // Display Summery
      calcDisplaySummary(acc);
}

// Event Handler 

let currentAccount;

// Fake Always Loged In
currentAccount = account1;
updateUi(currentAccount);
containerApp.style.opacity = 100;

// Login Function

btnLogin.addEventListener('click', function (event){
  //prevent the form from submitting
  event.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value);
    console.log(currentAccount);

  if (currentAccount?.pin === +(inputLoginPin.value)){
    // Display UI and Welcom Message
    labelWelcome.textContent = `Welcom Back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Create Crrent Date And Time

    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth()}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear Input Fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

// Update UI 
    updateUi(currentAccount);
  }
});

// Balance Transfer Function

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = +(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value);

  // Clear The Transfer Money Form
  inputTransferAmount.value = '';
  inputTransferTo.value = '';

  if (amount > 0 && currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.createUserName){
      // Doing The Transfer
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);

      // Add The Transfer Date
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());

      // Update The Ui
      updateUi(currentAccount);
    }
})

// Reqest Loan Function 

btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    // Add The Movement To Current Account
    currentAccount.movements.push(amount);
    // Add The Loan Deposit Date
    currentAccount.movementsDates.push(new Date().toISOString());
    // Update The Ui With The New Movement
    updateUi(currentAccount);
    // Clear Input Amount
    inputLoanAmount.value = '';
  }
})

// Close Account Function 

btnClose.addEventListener('click', function(e){
  e.preventDefault();

  if(inputCloseUsername.value === currentAccount.username &&
    +(inputClosePin.value) === currentAccount.pin){
      
      const index = accounts.findIndex(
        acc => acc.username === currentAccount.username);

      // Delet Account
      accounts.splice(index, 1);
      // Hide Ui
      containerApp.style.opacity = 0;
    }

    // Clear Close Account Inputs
    inputCloseUsername.value = inputClosePin.value = '';
})

// Sort Movements Function

let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURE