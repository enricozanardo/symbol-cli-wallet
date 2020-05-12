import readlineSync from 'readline-sync';
import { loadWallet } from './storage';
import { getBalance, createAccount, sendCoins } from './wallet';

import { MOSAIC_NAME } from './wallet';

const CFont = require('cfonts');
const clear = require('clear');
var colors = require('colors/safe');

async function cmdBalance() {
  const wallet = await loadWallet();
  await getBalance(wallet.address);
  // Go back?
  loadCli();
}

async function cmdSendCoins() {
  await sendCoins();
  loadCli();
}

function cmdCreateAccount() {
  createAccount();
  loadCli();
}

function loadCli() {
  setTimeout(() => {
    back();
  }, 1000);
}

async function back() {
  if (readlineSync.keyInYN('Go back?')) {
    cli();
  } else {
    process.exit();
  }
}

const enum Commands {
  create = 'CREATE',
  balance = 'BALANCE',
  transaction = 'TRANSACTION',
  close = 'CLOSE',
}

export function cli() {
  clear();

  CFont.say(`UnicalCoin`, { gradient: 'red,blue', align: 'center' });

  console.log(
    colors.red.underline(
      `Command Line Interface for ${MOSAIC_NAME} powered by Enrico Zanardo`
    )
  );

  var menu = require('readline-sync'),
    commands = [
      Commands.create,
      Commands.balance,
      Commands.transaction,
      Commands.close,
    ],
    index = menu.keyInSelect(commands, 'Commands');

  switch (commands[index]) {
    case Commands.create:
      cmdCreateAccount();
      break;
    case Commands.balance:
      cmdBalance();
      break;
    case Commands.transaction:
      cmdSendCoins();
      break;
    case Commands.close:
      process.exit();
      break;
    default:
      cli();
      break;
  }
}
