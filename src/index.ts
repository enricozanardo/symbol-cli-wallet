import readlineSync from 'readline-sync';
import { RepositoryFactoryHttp } from 'symbol-sdk';

import { createAccount, getBalance, sendCoins } from './wallet';
import { loadWallet } from './storage';

import { cli } from './cli';

async function main() {
  cli();
}

main();
