const Blockchain = require('../blockchain');
const Block = require('../blockchain/block');
const cryptoHash = require('../util/cryptoHash');

describe('Blockchain', () => {
    let blockchain,newChain, origChain;

    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        origChain = blockchain.chain;
    });

    it('contains a `chain` Array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with the genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain', () => {
        const newData = 'foo bar';
        blockchain.addBlock(newData);
        blockchain.addBlock({data:newData});
        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });

    describe('isValidChain()',() =>{
        describe('when the chain does not start with the genesis block', () => {

            beforeEach(() => {
                blockchain.addBlock({data:'foo'});
                blockchain.addBlock({data:'foo2'});
                blockchain.addBlock({data:'foo3'});
            });

            it('returns false', () => {
                blockchain.chain[0] = { data: 'fake-genesis' };
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });


            describe('when the chain starts with the genesis block and has multiple blocks', () =>{
                describe('and a lastHash reference has changed', () =>{
                    it('returns false', () =>{
                        blockchain.chain[2].lastHash = 'broken-lastHash';
                        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                    });
                });
                describe('and the chain contains a block with an invalid field', () =>{
                    it('returns false', () =>{
                        blockchain.chain[2].data = 'invalid data';
                        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                    });
                });

                describe("and the chain contains a block with a jumped difficulty", () =>{
                    it("returns false", () =>{
                        const lastBlock = blockchain.chain[blockchain.chain.length-1];
                        const lastHash = lastBlock.hash;
                        const timestamp = Date.now();
                        const nonce = 0;
                        const data = [];
                        const difficulty = lastBlock.difficulty-3;
                        const hash = cryptoHash(timestamp,lastHash,data,nonce,difficulty);
                        const badBlock = new Block({timestamp,lastHash,hash,data,nonce,difficulty});
                        blockchain.chain.push(badBlock);
                        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                    });
                });

                describe('and the chain does not contain any invalid blocks', () =>{
                    it('returns true', () =>{
                        expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                    });
                });
            });
        });
    });

    describe('replaceChain()',() =>{

        let errorMock, logMock;

        beforeEach(() =>{
            errorMock = jest.fn();
            logMock = jest.fn();
            global.console.error = errorMock;
            global.console.log = logMock;
        });

        describe('when the new chain is not longer', () =>{

            beforeEach(() =>{
                newChain.chain[0] = {new: 'chain'};
                blockchain.replaceChain(newChain.chain);
            });

            it('does not replace the chain', () =>{
                expect(blockchain.chain).toEqual(origChain);
            });
            it('logs an error', () =>{
                expect(errorMock).toHaveBeenCalled();
            });
        });

        describe('when te chain is longer',() =>{

            beforeEach(() =>{
                newChain.addBlock({data:'foo'});
                newChain.addBlock({data:'foo2'});
                newChain.addBlock({data:'foo3'});
            });

            describe('and the chain is invalid',() =>{

                beforeEach(() =>{
                    newChain.chain[2].hash = 'invalidHash';
                    blockchain.replaceChain(newChain.chain);
                });

                it('does not replace the chain', () =>{
                    expect(blockchain.chain).toEqual(origChain);
                });

                it('logs an error', () =>{
                    expect(errorMock).toHaveBeenCalled();
                });

            });
            describe('and the chain is valid',() =>{

                beforeEach(() =>{
                    blockchain.replaceChain(newChain.chain);
                });

                it('replaces the chain', () =>{
                    expect(blockchain.chain).toEqual(newChain.chain);
                });

                it('logs about the chain replacement', () =>{
                    expect(logMock).toHaveBeenCalled();
                });
            });
        });
    });
});