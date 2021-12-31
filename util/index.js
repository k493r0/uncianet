const EC = require('elliptic').ec;
const cryptoHash = require('./cryptoHash');
const ec = new EC('secp256k1');

const verifySignature = ({publicKey, data, signature}) => {
    const key = ec.keyFromPublic(publicKey, 'hex');
    return key.verify(cryptoHash(data), signature);
};

module.exports = {ec, verifySignature};