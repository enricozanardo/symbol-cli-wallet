import { Account, Password, SimpleWallet } from 'symbol-sdk';
export declare type Secrets = {
    password: Password;
    privateKey: string;
    walletName: string;
};
export declare function storeSecrets(secrets: Secrets): void;
export declare function loadAccount(): Promise<Account>;
export declare function loadWallet(): Promise<SimpleWallet>;
