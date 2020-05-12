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
const readline_sync_1 = __importDefault(require("readline-sync"));
const storage_1 = require("./storage");
const wallet_1 = require("./wallet");
const wallet_2 = require("./wallet");
const CFont = require('cfonts');
const clear = require('clear');
var colors = require('colors/safe');
function cmdBalance() {
    return __awaiter(this, void 0, void 0, function* () {
        const wallet = yield storage_1.loadWallet();
        yield wallet_1.getBalance(wallet.address);
        // Go back?
        loadCli();
    });
}
function cmdSendCoins() {
    return __awaiter(this, void 0, void 0, function* () {
        yield wallet_1.sendCoins();
        loadCli();
    });
}
function cmdCreateAccount() {
    wallet_1.createAccount();
    loadCli();
}
function loadCli() {
    setTimeout(() => {
        back();
    }, 1000);
}
function back() {
    return __awaiter(this, void 0, void 0, function* () {
        if (readline_sync_1.default.keyInYN('Go back?')) {
            cli();
        }
        else {
            process.exit();
        }
    });
}
function cli() {
    clear();
    CFont.say(`UnicalCoin`, { gradient: 'red,blue', align: 'center' });
    console.log(colors.red.underline(`Command Line Interface for ${wallet_2.MOSAIC_NAME} powered by Enrico Zanardo`));
    var menu = require('readline-sync'), commands = [
        "CREATE" /* create */,
        "BALANCE" /* balance */,
        "TRANSACTION" /* transaction */,
        "CLOSE" /* close */,
    ], index = menu.keyInSelect(commands, 'Commands');
    switch (commands[index]) {
        case "CREATE" /* create */:
            cmdCreateAccount();
            break;
        case "BALANCE" /* balance */:
            cmdBalance();
            break;
        case "TRANSACTION" /* transaction */:
            cmdSendCoins();
            break;
        case "CLOSE" /* close */:
            process.exit();
            break;
        default:
            cli();
            break;
    }
}
exports.cli = cli;
