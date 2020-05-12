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
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_1 = require("./wallet");
const storage_1 = require("./storage");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // createAccount();
        // const wallet = await loadWallet(); // TB4OGR-3BXBKR-IVQFJP-MKUSJX-6UIFUE-OTYAOC-3OWQ
        // getBalance(wallet.address);
        const to = 'TBMXSZXAEK7X6JC4XB7R5Y4JGPWNBALTBTYV4KAK';
        const amount = 22;
        const text = 'Hi there';
        const rawTx = wallet_1.createTransaction(to, amount, text);
        const account = yield storage_1.loadAccount();
        const signedTx = wallet_1.signTransaction(account, rawTx);
        const response = yield wallet_1.doTransaction(signedTx);
        console.log(response);
        // process.exit();
    });
}
main();
