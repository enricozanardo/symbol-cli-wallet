import {
  NetworkType,
  Account,
  SimpleWallet,
  Password,
  RepositoryFactoryHttp,
  Address,
  AccountInfo,
  TransactionService,
  TransactionHttp,
  TransferTransaction,
  Mosaic,
  MosaicId,
  UInt64,
  Deadline,
  PlainMessage,
  SignedTransaction,
  TransactionAnnounceResponse,
} from 'symbol-sdk';
import readlineSync from 'readline-sync';

import { storeSecrets, Secrets } from './storage';
import { generateMnemonicPrivateKey } from './crypto';

export const NETWORKTYPE = NetworkType.TEST_NET;
export const MOSAIC_NAME = 'unicalcoins';

const MOSAIC_ID_UNICALCOIN = '6CAA8A74284FC608';
const unicalcoin_divisibility = 0;

const HELP = 'ezanardo@onezerobinary.com';

const nodeUrl = 'http://api-01.eu-central-1.symboldev.network:3000';
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
const accountHttp = repositoryFactory.createAccountRepository();

const generationHash =
  '44D2225B8932C9A96DCB13508CBCDFFA9A9663BFBA2354FEEC8FCFCB7E19846C';

const transactionRepository = repositoryFactory.createTransactionRepository();
const receiptHttp = repositoryFactory.createReceiptRepository();
const listener = repositoryFactory.createListener();
const transactionService = new TransactionService(
  transactionRepository,
  receiptHttp
);

// TX
export function createTransaction(
  rawRecipientAddress: string,
  amount: number,
  text: string
): TransferTransaction {
  const recipientAddress = Address.createFromRawAddress(rawRecipientAddress);
  const currency = new MosaicId(MOSAIC_ID_UNICALCOIN);

  const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    recipientAddress,
    [
      new Mosaic(
        currency,
        UInt64.fromUint(amount * Math.pow(10, unicalcoin_divisibility))
      ),
    ],
    PlainMessage.create(text),
    NETWORKTYPE,
    UInt64.fromUint(2000000)
  );

  return transferTransaction;
}

// Sign
export function signTransaction(
  account: Account,
  tx: TransferTransaction
): SignedTransaction {
  return account.sign(tx, generationHash);
}

// Announce the transaction to the network
export async function doTransaction(
  signedTx: SignedTransaction
): Promise<TransactionAnnounceResponse> {
  return new Promise<TransactionAnnounceResponse>((resolve, reject) => {
    transactionRepository.announce(signedTx).subscribe(
      (tx) => {
        // console.log(`\nTransaction info: ${tx.message}\n`);
        resolve(tx);
      },
      (err: Error) => {
        reject(
          console.log(
            `\nIt was not possible to do the transfer. Error: ${err}\n`
          )
        );
      }
    );
  });
}

export async function getBalance(address: Address): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    accountHttp.getAccountInfo(address).subscribe((accountInfo) => {
      let mosaics = accountInfo.mosaics;
      let mosaic = mosaics.find(
        (mosaic) => mosaic.id.toHex() == MOSAIC_ID_UNICALCOIN
      );

      if (mosaic) {
        console.log(
          `\nYou have ${mosaic.amount.toString()} ${MOSAIC_NAME} in your wallet`
        );
      } else {
        console.log(`\n You have 0 ${MOSAIC_NAME} in your balance.`);
        console.log(`\n You could ask to ${HELP} for some ${MOSAIC_NAME}`);
      }
      resolve(true);
    }),
      (err: Error) => {
        reject(
          console.log(
            `An error was happening and it was not possible to check the balance: ${err}`
          )
        );
      };
  });
}

export function createAccount() {
  console.log(`\nPlease enter an unique passord (8 character minumum).\n`);

  let inputPassword = readlineSync.questionNewPassword(`\nInput a Password: `, {
    min: 8,
    max: 12,
  });
  const password = new Password(inputPassword);

  let walletName = readlineSync.question('\nGive to the wallet a name: ');

  const priv_key = generateMnemonicPrivateKey();

  const wallet = SimpleWallet.createFromPrivateKey(
    walletName,
    password,
    priv_key,
    NETWORKTYPE
  );

  const secret: Secrets = {
    password: password,
    privateKey: priv_key,
    walletName: walletName,
  };

  console.log(
    `A new wallet is generated with address: ${wallet.address.pretty()}`
  ); // TCGCYI-IOBQQB-M7P7DW-SAA2FT-AQG67E-YRJZVN-EGZ7

  console.log(`You can now start to send and receive ${MOSAIC_NAME}`);

  storeSecrets(secret);
}
