import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class App extends Component{
    state = {walletInfo: {}};

    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
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
            <br/>
                <div><Link to='/blocks'>Blocks</Link></div>
                <div><Link to='/create-transaction'>Make Transaction</Link></div>
                <div><Link to='/transaction-pool'>Transaction Pool</Link></div>
                <br/>
                <div className='WalletInfo'>
                    <div>Address: {address} </div>
                    <div>Balance: {balance} </div>
                </div>
            </div>
        );
    }
}

export default App;