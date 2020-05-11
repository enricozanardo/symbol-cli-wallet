import readlineSync from 'readline-sync';
import { RepositoryFactoryHttp } from 'symbol-sdk';

import {
  createAccount,
  getBalance,
  createTransaction,
  signTransaction,
  doTransaction,
} from './wallet';
import { loadWallet, loadAccount } from './storage';

async function main() {
  // createAccount();
  // const wallet = await loadWallet(); // TB4OGR-3BXBKR-IVQFJP-MKUSJX-6UIFUE-OTYAOC-3OWQ

  // getBalance(wallet.address);

  const to = 'TBMXSZXAEK7X6JC4XB7R5Y4JGPWNBALTBTYV4KAK';
  const amount = 15;
  const text = 'Hi there';

  const rawTx = createTransaction(to, amount, text);

  const account = await loadAccount();
  const signedTx = signTransaction(account, rawTx);

  const response = await doTransaction(signedTx);

  console.log(response);

  // process.exit();
}

main();
