import os from 'os';
import fs, { readFileSync } from 'fs';
import { Account, Password, SimpleWallet, NetworkType } from 'symbol-sdk';
import readlineSync from 'readline-sync';

import { MOSAIC_NAME, NETWORKTYPE } from './wallet';
import { resolve } from 'dns';
import { rejects } from 'assert';

export type Secrets = {
  password: Password;
  privateKey: string;
  walletName: string;
};

export function storeSecrets(secrets: Secrets) {
  const PATH_HOME = `${os.homedir()}/${MOSAIC_NAME}-wallets`;
  const PATH_WALLET = `${PATH_HOME}/${MOSAIC_NAME}-wallet.enry`;

  if (!fs.existsSync(PATH_HOME)) {
    fs.mkdirSync(PATH_HOME);
  }

  let fullPath = PATH_WALLET;
  if (fs.existsSync(fullPath)) {
    const stamp = new Date().toISOString();
    fullPath = `${PATH_HOME}/${stamp}-${MOSAIC_NAME}-secrets.enry`;
  }

  fs.writeFileSync(fullPath, JSON.stringify(secrets));

  console.log(`Secrets stored!. ${fullPath}`);
}

export async function loadAccount(): Promise<Account> {
  return new Promise<Account>((resolve, reject) => {
    const PATH_HOME = `${os.homedir()}/${MOSAIC_NAME}-wallets`;
    const PATH_WALLET = `${PATH_HOME}/${MOSAIC_NAME}-wallet.enry`;

    const text = fs.readFileSync(PATH_WALLET, 'utf8');
    const secrects: Secrets = JSON.parse(text);

    const account = Account.createFromPrivateKey(
      secrects.privateKey,
      NETWORKTYPE
    );

    try {
      resolve(account);
    } catch {
      reject(console.log(`It was not possible to retrive the account`));
    }
  });
}

export async function loadWallet(): Promise<SimpleWallet> {
  const PATH_HOME = `${os.homedir()}/${MOSAIC_NAME}-wallets`;
  const PATH_WALLET = `${PATH_HOME}/${MOSAIC_NAME}-wallet.enry`;

  const text = fs.readFileSync(PATH_WALLET, 'utf8');
  const secrects: Secrets = JSON.parse(text);

  const password = readlineSync.question(`\nInput Password: `, {
    hideEchoBack: true,
  });

  if (password != secrects.password.value) {
    console.log(`\nPassword provided is wrong`);
    loadWallet();
  }
  console.log(`\n Right Password was provided!`);

  const wallet = SimpleWallet.createFromPrivateKey(
    secrects.walletName,
    secrects.password,
    secrects.privateKey,
    NETWORKTYPE
  );

  console.log(`Wallet Public Key is: ${wallet.address.pretty()}`);

  return wallet;
}
