import { NetworkType, Address } from 'symbol-sdk';
export declare const NETWORKTYPE = NetworkType.TEST_NET;
export declare const MOSAIC_NAME = "unicalcoins";
export declare function sendCoins(): Promise<boolean>;
export declare function getBalance(address: Address): Promise<boolean>;
export declare function createAccount(): void;
