import React, {Component} from 'react';
import Blocks from './Blocks';

class App extends Component{
    state = {walletInfo: {}};

    componentDidMount() {
        fetch('http://localhost:3000/api/wallet-info')
            .then(res => res.json())
            .then(walletInfo => this.setState({walletInfo}));
    }

    render(){

        const {address, balance} = this.state.walletInfo;

        return(
            <div>

            <div>
                <h1>UnciaBit | Blockchain Simulation |</h1>
            </div>
                <div>Address: {address} </div>
                <div>Balance: {balance} </div>
                <br/>
                <Blocks />
            </div>
        );
    }
}

export default App;