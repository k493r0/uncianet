const Block = require('./block');
const cryptoHash = require('./cryptoHash.js');

class Blockchain {
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
        if (!Blockchain.isValidChain(chain)){
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
            const {timestamp, lastHash, hash, data} = chain[i];
            const chainlastHash = chain[i-1].hash;
            if (lastHash !== chainlastHash) {
                return false;
            }

            const validHash = cryptoHash(timestamp, lastHash, data);

            if (hash !== validHash) {
                return false;
            }
        }

        return true;
    }
}

module.exports = Blockchain;