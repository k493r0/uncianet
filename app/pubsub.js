const redis = require('redis');

const CHANNELS = {
    TEST:'TEST',
    BLOCKCHAIN:'BLOCKCHAIN',
    TRANSACTION:'TRANSACTION'
}

class PubSub{
    constructor({blockchain, transactionPool}) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;

        this.publisher = redis.createClient({
            host: '172.20.10.12',
            port: 6379
        });
        this.subscriber = redis.createClient({
            host: '172.20.10.12',
            port: 6379
            }
        );

        this.subscribeToChannels();

        this.subscriber.on('message', (channel, message) => this.handleMessage(channel, message))
    }
    handleMessage(channel,message){
        console.log(`Message received on channel ${channel}: ${message}`);

        const parsedMessage = JSON.parse(message);

        switch (channel){
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage, () =>{
                    this.transactionPool.clearBlockchainTransactions({
                        chain: parsedMessage
                    });
                });
                break;
            case CHANNELS.TRANSACTION:
                this.transactionPool.setTransaction(parsedMessage);
                break;
            default:
                return;
        }

        if (channel === CHANNELS.BLOCKCHAIN){
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    subscribeToChannels(){
        Object.values(CHANNELS).forEach(channel => this.subscriber.subscribe(channel));
    }

    publish(channel, message){

        this.subscriber.unsubscribe(channel, ()=>{
            this.publisher.publish(channel, message, ()=>{
                this.subscriber.subscribe(channel);
            });
        });

        this.publisher.publish(channel, message, (err, data) => {
            if(err) throw err;
        });
    }

    broadcastChain(){
        this.publish(CHANNELS.BLOCKCHAIN, JSON.stringify(this.blockchain.chain));
    }

    broadcastTransaction(transaction){
        this.publish(CHANNELS.TRANSACTION, JSON.stringify(transaction));
    }

}

module.exports = PubSub;