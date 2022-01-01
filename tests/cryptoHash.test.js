const {cryptoHash} = require('../util');

describe('cryptoHash()',() => {
    it('generates a SHA-256 hashed output',() => {
         expect(cryptoHash('foo')).toEqual('b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b');
    });
    it('produces the same hash with the same input arguments in any order',() => {
        expect(cryptoHash('test1','test2','test3'))
            .toEqual(cryptoHash('test1','test2','test3'));
    });

    it('produces a different hash with different input arguments',() => {
        const foo = {};
        const original = cryptoHash(foo);
        foo['a'] = 'a';
        expect(cryptoHash(foo)).not.toEqual(original);
    });
});