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

const formatMovementsDate = function(date, locale){
  
  const calcDayPassed = (date1, date2) => Math.round
  (Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));
  const dayPassed = calcDayPassed(new Date(), date)
  if (dayPassed === 0) return 'Today'
  if (dayPassed === 1) return 'Yeasterday'
  if (dayPassed <= 7) return`${dayPassed} Days Ago`
  // else {
  //   const day = `${date.getDate()}`.padStart(2, 0);
  //   const month = `${date.getMonth()}`.padStart(2, 0);
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // }
  return new Intl.DateTimeFormat(locale).format(date);
}

// Function Format Currency

const formatCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(
    locale, {
      style: 'currency',
      currency: currency,
  }).format(value)
};

// Function Displays The Account Movemnets

const displayMovements = function (acc, sort = false) {

  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function(mov, i){

    const type = mov > 0 ? 'deposit' : 'withdrawal'; 
    
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date, acc.locale);

    const formattedMov = formatCurr(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

// Function Calculates An Displays The Account Balance

const callDisplayBalance = function(acc){
  acc.balance = acc.movements
  .reduce((acc, mov) => acc + mov);
  labelBalance.textContent = formatCurr(acc.balance, acc.locale, acc.currency);
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
  labelSumIn.textContent = formatCurr(incomes, acc.locale, acc.currency);

  const outes = acc.movements
  .filter((mov) => mov < 0)
  .reduce((acc, curr) => acc + curr);
  labelSumOut.textContent = formatCurr(Math.abs(outes), acc.locale, acc.currency);

  const interest = acc.movements
  .filter((mov) => mov > 0)
  .map((deposit) => deposit * acc.interestRate/100)
  .filter((interest) => interest >= 1)
  .reduce((acc, curr) => acc + curr);
  labelSumInterest.textContent = formatCurr(interest, acc.locale, acc.currency);
}

const updateUi = function(acc){
      // Display M
      displayMovements(acc);
      // Display Balance 
      callDisplayBalance(acc);
      // Display Summery
      calcDisplaySummary(acc);
}

const startLogOutTimer = function(){
  const tick = function() {
    // In each call, print the remianing time to ui
      const min = String(Math.trunc(time / 60)).padStart(2, 0);
      const sec = String(time % 60).padStart(2, 0);
      labelTimer.textContent = `${min}:${sec}`;
  
    // When 0 second, stopp the timer and logout the user
    if (time === 0){
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // Decrease 1 sec
    time--
    }
  // Set Time To 5 min
  let time = 30;

  // Call the timer every second
  tick();
  let timer = setInterval(tick, 1000)
  return timer;
}

// Event Handler 

let currentAccount, timer;

// Fake Always Loged In
// currentAccount = account1;
// updateUi(currentAccount);
// containerApp.style.opacity = 100;

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
      const options = {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      };

      labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale,
        options).format(now);

    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth()}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear Input Fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

// Start log out time 
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();

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

      // Reset Timer
      timer = clearInterval(timer);
      timer = startLogOutTimer();
    }
})

// Reqest Loan Function 

btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    setTimeout(function(){
      // Add The Movement To Current Account
      currentAccount.movements.push(amount);
      
      // Add The Loan Deposit Date
      currentAccount.movementsDates.push(new Date().toISOString());
      
      // Update The Ui With The New Movement
      updateUi(currentAccount);
      
      // Clear Input Amount
      inputLoanAmount.value = '';

      // Reset Timer
      timer = clearInterval(timer);
      timer = startLogOutTimer();
  }, 1000);
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


