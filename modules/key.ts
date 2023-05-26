interface Key {
    address: string;
    privateKey: string;
}

interface encryptedkey {
    address: string;
    crypto: any;
}

interface EncryptKeyInterface {
    key: Key;
    auth: string;
    scryptN: any;
    scryptP: Number;
}

interface DecryptKeyInterface {
    keyJson: Uint8Array;
    auth: string;
}

interface decryptKeyInterface {
    key: encryptedkey;
    auth: string;
}

function EncryptKey(params: EncryptKeyInterface) {

}

function DecryptKey(params: DecryptKeyInterface) {

}

function decryptKey(params: decryptKeyInterface) {

}