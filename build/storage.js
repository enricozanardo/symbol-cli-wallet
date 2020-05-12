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
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const symbol_sdk_1 = require("symbol-sdk");
const readline_sync_1 = __importDefault(require("readline-sync"));
var colors = require('colors/safe');
const wallet_1 = require("./wallet");
function storeSecrets(secrets) {
    const PATH_HOME = `${os_1.default.homedir()}/${wallet_1.MOSAIC_NAME}-wallets`;
    const PATH_WALLET = `${PATH_HOME}/${wallet_1.MOSAIC_NAME}-wallet.enry`;
    if (!fs_1.default.existsSync(PATH_HOME)) {
        fs_1.default.mkdirSync(PATH_HOME);
    }
    let fullPath = PATH_WALLET;
    if (fs_1.default.existsSync(fullPath)) {
        const stamp = new Date().toISOString();
        fullPath = `${PATH_HOME}/${stamp}-${wallet_1.MOSAIC_NAME}-secrets.enry`;
    }
    fs_1.default.writeFileSync(fullPath, JSON.stringify(secrets));
    console.log(colors.yellow(`\nSecrets stored!. ${fullPath}`));
}
exports.storeSecrets = storeSecrets;
function loadAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const PATH_HOME = `${os_1.default.homedir()}/${wallet_1.MOSAIC_NAME}-wallets`;
            const PATH_WALLET = `${PATH_HOME}/${wallet_1.MOSAIC_NAME}-wallet.enry`;
            const text = fs_1.default.readFileSync(PATH_WALLET, 'utf8');
            const secrects = JSON.parse(text);
            const password = readline_sync_1.default.question(`\nInput Password: `, {
                hideEchoBack: true,
            });
            if (password != secrects.password.value) {
                console.log(colors.red(`\nPassword provided is wrong`));
                loadAccount();
            }
            const account = symbol_sdk_1.Account.createFromPrivateKey(secrects.privateKey, wallet_1.NETWORKTYPE);
            try {
                resolve(account);
            }
            catch (_a) {
                reject(console.log(colors.red(`\nIt was not possible to retrive the account`)));
            }
        });
    });
}
exports.loadAccount = loadAccount;
function loadWallet() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const PATH_HOME = `${os_1.default.homedir()}/${wallet_1.MOSAIC_NAME}-wallets`;
            const PATH_WALLET = `${PATH_HOME}/${wallet_1.MOSAIC_NAME}-wallet.enry`;
            const text = fs_1.default.readFileSync(PATH_WALLET, 'utf8');
            const secrects = JSON.parse(text);
            const password = readline_sync_1.default.question(`\nInput Password: `, {
                hideEchoBack: true,
            });
            if (password != secrects.password.value) {
                console.log(colors.red(`\nPassword provided is wrong`));
                loadWallet();
            }
            console.log(colors.green(`\nRight Password was provided!`));
            const wallet = symbol_sdk_1.SimpleWallet.createFromPrivateKey(secrects.walletName, secrects.password, secrects.privateKey, wallet_1.NETWORKTYPE);
            console.log(colors.yellow(`\nWallet Public Key is: ${wallet.address.pretty()}`));
            try {
                resolve(wallet);
            }
            catch (_a) {
                reject(`It was not possible to load the wallet.`);
            }
        });
    });
}
exports.loadWallet = loadWallet;
