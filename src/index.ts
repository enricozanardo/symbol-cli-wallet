import readlineSync from 'readline-sync';
import { RepositoryFactoryHttp } from 'symbol-sdk';

import { createAccount, getBalance, sendCoins } from './wallet';
import { loadWallet } from './storage';

async function main() {
  // createAccount();
  // const wallet = await loadWallet(); // TB4OGR-3BXBKR-IVQFJP-MKUSJX-6UIFUE-OTYAOC-3OWQ
  // getBalance(wallet.address);
  // process.exit();

  sendCoins();
}

main();
