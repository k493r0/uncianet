const Block = require('./block');
const cryptoHash = require('../util/cryptoHash.js');

class Index {
    constructor() {
        this.chain = [Block.genesis()];
    }
    addBlock({data}){
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        });
        this.chain.push(newBlock);
    }

    replaceChain(chain){
        if(chain.length <= this.chain.length){
            console.error('The incoming chain must be longer');
            return;
        }
        if (!Index.isValidChain(chain)){
            console.error('The incoming chain must be valid');
            return;
        }
        console.log('Replacing blockchain with', chain);
        this.chain = chain;
    }

    static isValidChain(chain){
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for (let i=1; i<chain.length; i++) {
            const {timestamp, lastHash, hash, nonce, difficulty, data} = chain[i];
            const chainlastHash = chain[i-1].hash;
            const lastDifficulty = chain[i-1].difficulty;

            if (lastHash !== chainlastHash) {
                return false;
            }

            const validHash = cryptoHash(timestamp, lastHash, nonce, difficulty, data);

            if (hash !== validHash) {
                return false;
            }

            if (Math.abs(lastDifficulty - difficulty) > 1){
                return false;
            }
        }

        return true;
    }
}

module.exports = Index;