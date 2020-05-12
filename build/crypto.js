"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mnGen = require('mngen');
const hasha_1 = __importDefault(require("hasha"));
var colors = require('colors/safe');
function sha256(word) {
    return hasha_1.default(word, { algorithm: 'sha256', encoding: 'hex' });
}
function generateMnemonicPrivateKey() {
    const mnemonic = mnGen.list(4); // [provide,crimson,float,carrot]
    console.log(`Write down those mnemonic worlds that are used to generate your private key:`);
    console.log(colors.yellow(`\n${mnemonic}`));
    let hashes = [];
    mnemonic.map((world) => {
        hashes.push(sha256(world));
    });
    // Pseudo Merkle Tree
    let tmp_result_1 = sha256(hashes[0] + hashes[1]);
    let tmp_result_2 = sha256(hashes[2] + hashes[3]);
    let privateKey = sha256(tmp_result_1 + tmp_result_2);
    return privateKey;
}
exports.generateMnemonicPrivateKey = generateMnemonicPrivateKey;
