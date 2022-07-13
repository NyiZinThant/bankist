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
  username: 'js',

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-05-12T23:36:17.929Z',
    '2022-07-11T17:01:17.194Z',
    '2022-07-13T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  username: 'jd',

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
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

const formatDate = function (date) {
  const calcDayPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  const dayPassed = calcDayPassed(new Date(), date);
  console.log(dayPassed);
  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;
  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const displayMovement = function (account, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  movs.forEach(function (mov, i) {
    const date = new Date(account.movementsDates[i]);
    const displayDate = formatDate(date);
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr);
  labelBalance.textContent = `${acc.balance.toFixed(2)} EUR`;
};

const displaySummary = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => (acc += mov), 0);
  labelSumIn.textContent = `${income.toFixed(2)} €`;

  const outcome = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => (acc += mov), 0);
  labelSumOut.textContent = `${Math.abs(outcome.toFixed(2))} €`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acu, mov) => acu + mov, 0);
  labelSumInterest.textContent = `${Math.abs(interest.toFixed(2))} €`;
};

const updateUi = function (account) {
  // Display Movements
  displayMovement(account);
  // Display Balance
  displayBalance(account);
  // Display Summary
  displaySummary(cAccount);
};

// Event handler
let cAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  cAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (cAccount?.pin === Number(inputLoginPin.value)) {
    // Clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    // Display Current Date
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    // Display UI messages
    labelWelcome.textContent = `Welcome back, ${cAccount.owner}`;
    containerApp.style.opacity = 1;
    updateUi(cAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(
    acc => acc.username === inputTransferTo.value.trim()
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiver &&
    amount <= cAccount.balance &&
    receiver?.username !== cAccount.username
  ) {
    // doing transfer
    cAccount.movements.push(-amount);
    receiver.movements.push(amount);
    cAccount.movementsDates.push(new Date().toISOString());
    receiver.movementsDates.push(new Date().toISOString());
    cAccount.balance -= amount;
    receiver.balance += amount;
    updateUi(cAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    cAccount.username === inputCloseUsername.value &&
    cAccount.pin === Number(inputClosePin.value)
  ) {
    const accIndex = accounts.findIndex(
      acc => acc.username === cAccount.username
    );
    accounts.splice(accIndex, 1);
    console.log(accounts);
    containerApp.style.opacity = 0;
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && cAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add New Movements
    cAccount.movements.push(amount);
    // Add New Movements Dates
    cAccount.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUi(cAccount);
  }
  inputLoanAmount.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovement(cAccount.movements, sorted);
});
