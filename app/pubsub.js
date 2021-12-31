const redis = require('redis');

const CHANNELS = {
    TEST:'TEST',
    BLOCKCHAIN:'BLOCKCHAIN'
}

class PubSub{
    constructor({blockchain}) {
        this.blockchain = blockchain;

        this.publisher = redis.createClient({
            host: '172.20.10.8',
            port: 6379
        });
        this.subscriber = redis.createClient({
            host: '172.20.10.8',
            port: 6379
            }
        );

        this.subscribeToChannels();

        this.subscriber.on('message', (channel, message) => this.handleMessage(channel, message))
    }
    handleMessage(channel,message){
        console.log(`Message received on channel ${channel}: ${message}`);

        const parsedMessage = JSON.parse(message);

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

}

module.exports = PubSub;