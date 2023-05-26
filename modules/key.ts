interface Key {
    address: string;
    privateKey: string;
}

interface EncryptedKey {
    address: string;
    crypto: any;
}

interface EncryptKeyOptions {
    key: Key;
    auth: string;
    scryptN: any;
    scryptP: number;
}

interface DecryptKeyOptions {
    keyJson: Uint8Array;
    auth: string;
}

interface PrivDecryptKeyOptions {
    key: EncryptedKey;
    auth: string;
}

function encryptKey(params: EncryptKeyOptions) {

}

function decryptKey(params: DecryptKeyOptions) {

}

function private_decryptKey(params: PrivDecryptKeyOptions) {

}