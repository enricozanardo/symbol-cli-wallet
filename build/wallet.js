"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const symbol_sdk_1 = require("symbol-sdk");
const readline_sync_1 = __importDefault(require("readline-sync"));
var colors = require('colors/safe');
const storage_1 = require("./storage");
const crypto_1 = require("./crypto");
exports.NETWORKTYPE = symbol_sdk_1.NetworkType.TEST_NET;
exports.MOSAIC_NAME = 'unicalcoins';
const MOSAIC_ID_UNICALCOIN = '6CAA8A74284FC608';
const unicalcoin_divisibility = 0;
const HELP = 'ezanardo@onezerobinary.com';
const nodeUrl = 'http://api-01.eu-central-1.symboldev.network:3000';
const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
const accountHttp = repositoryFactory.createAccountRepository();
const generationHash = '44D2225B8932C9A96DCB13508CBCDFFA9A9663BFBA2354FEEC8FCFCB7E19846C';
const transactionRepository = repositoryFactory.createTransactionRepository();
const receiptHttp = repositoryFactory.createReceiptRepository();
const listener = repositoryFactory.createListener();
const transactionService = new symbol_sdk_1.TransactionService(transactionRepository, receiptHttp);
function sendCoins() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const account = yield storage_1.loadAccount();
            const rawRecipientAddress = readline_sync_1.default.question('\nWallet address [ex. TB..]: '); // TBMXSZXAEK7X6JC4XB7R5Y4JGPWNBALTBTYV4KAK
            const recipientAddress = symbol_sdk_1.Address.createFromRawAddress(rawRecipientAddress);
            const rawAmount = readline_sync_1.default.question(`\n${exports.MOSAIC_NAME} to send: `);
            const amount = parseInt(rawAmount);
            const textToSend = readline_sync_1.default.question('\nText to send: ');
            const rawTx = createTransaction(recipientAddress.pretty(), amount, textToSend);
            const signedTx = signTransaction(account, rawTx);
            yield doTransaction(signedTx);
            console.log(colors.green(`\n Transfered ${amount} ${exports.MOSAIC_NAME} from ${account.address.pretty()} to address: ${recipientAddress.pretty()} 🙌 🚀`));
            let checkURL = `\nTranscation link: ${nodeUrl}/transaction/${signedTx.hash}/status \n`;
            console.log(checkURL);
            try {
                resolve(true);
            }
            catch (_a) {
                reject(false);
            }
        }));
    });
}
exports.sendCoins = sendCoins;
// TX
function createTransaction(rawRecipientAddress, amount, text) {
    const recipientAddress = symbol_sdk_1.Address.createFromRawAddress(rawRecipientAddress);
    const currency = new symbol_sdk_1.MosaicId(MOSAIC_ID_UNICALCOIN);
    const transferTransaction = symbol_sdk_1.TransferTransaction.create(symbol_sdk_1.Deadline.create(), recipientAddress, [
        new symbol_sdk_1.Mosaic(currency, symbol_sdk_1.UInt64.fromUint(amount * Math.pow(10, unicalcoin_divisibility))),
    ], symbol_sdk_1.PlainMessage.create(text), exports.NETWORKTYPE, symbol_sdk_1.UInt64.fromUint(2000000));
    return transferTransaction;
}
// Sign
function signTransaction(account, tx) {
    return account.sign(tx, generationHash);
}
// Announce the transaction to the network
function doTransaction(signedTx) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            transactionRepository.announce(signedTx).subscribe((tx) => {
                // console.log(`\nTransaction info: ${tx.message}\n`);
                resolve(tx);
            }, (err) => {
                reject(console.log(`\nIt was not possible to do the transfer. Error: ${err}\n`));
            });
        });
    });
}
function getBalance(address) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            accountHttp.getAccountInfo(address).subscribe((accountInfo) => {
                let mosaics = accountInfo.mosaics;
                let mosaic = mosaics.find((mosaic) => mosaic.id.toHex() == MOSAIC_ID_UNICALCOIN);
                if (mosaic) {
                    console.log(`\nYou have ${mosaic.amount.toString()} ${exports.MOSAIC_NAME} in your wallet`);
                }
                else {
                    console.log(`\n You have 0 ${exports.MOSAIC_NAME} in your balance.`);
                    console.log(`\n You could ask to ${HELP} for some ${exports.MOSAIC_NAME}`);
                }
                resolve(true);
            }),
                (err) => {
                    reject(console.log(`An error was happening and it was not possible to check the balance: ${err}`));
                };
        });
    });
}
exports.getBalance = getBalance;
function createAccount() {
    console.log(`\nPlease enter an unique passord (8 character minumum).\n`);
    let inputPassword = readline_sync_1.default.questionNewPassword(`\nInput a Password: `, {
        min: 8,
        max: 12,
    });
    const password = new symbol_sdk_1.Password(inputPassword);
    let walletName = readline_sync_1.default.question('\nGive to the wallet a name: ');
    const priv_key = crypto_1.generateMnemonicPrivateKey();
    const wallet = symbol_sdk_1.SimpleWallet.createFromPrivateKey(walletName, password, priv_key, exports.NETWORKTYPE);
    const secret = {
        password: password,
        privateKey: priv_key,
        walletName: walletName,
    };
    console.log(`A new wallet is generated with address: ${wallet.address.pretty()}`); // TCGCYI-IOBQQB-M7P7DW-SAA2FT-AQG67E-YRJZVN-EGZ7
    console.log(`You can now start to send and receive ${exports.MOSAIC_NAME}`);
    storage_1.storeSecrets(secret);
}
exports.createAccount = createAccount;
