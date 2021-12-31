const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const Blockchain = require('./blockchain');
const PubSub = require('./pubsub');

const app = express();
const blockchain = new Blockchain();
const DEFAULT_PORT = 3000;
let PEER_PORT;
const pubsub = new PubSub({ blockchain });
const SERVER_IP = 'localhost';
const ROOT_NODE_ADDRESS = `http://${SERVER_IP}:${DEFAULT_PORT}`;

if (process.env.GENERATE_PEER_PORT === 'true'){
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;

app.use(bodyParser.json());

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
  const {data} = req.body;
  // console.log(`${ROOT_NODE_ADDRESS}`);
  blockchain.addBlock({data});
  pubsub.broadcastChain();
  res.redirect('/api/blocks');
});

const syncChains = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);
      console.log('Syncing chain...', rootChain);
      blockchain.replaceChain(rootChain);
    }
  });
};


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  if (PORT !== DEFAULT_PORT) {
    syncChains();
  }
});