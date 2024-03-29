import React, {Component} from "react";
import { FormGroup, FormControl, Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import history from "../history";

class CreateTransaction extends Component {
    state = {recipient: '', amount: 0}

    updateRecipient = (event) => {
        this.setState({recipient: event.target.value})
    }

    updateAmount = event =>{
        this.setState({amount: Number(event.target.value)})
    }

    createTransaction = () => {
        const {recipient, amount} = this.state;
        fetch('http://localhost:3000/api/transact',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({recipient, amount})
        }).then(response => response.json())
            .then(json => {
           alert(json.message || json.type);
           history.push('/transaction-pool');
        });
    }


    render() {
        console.log('this.state', this.state);
        return (
            <div className='CreateTransaction'>
                <Link to='/'>Home</Link>
                <h3>Create a Transaction</h3>
                <FormGroup>
                    <FormControl input='text' placeholder={'recipient'} value={this.state.recipient} onChange={this.updateRecipient}/>
                </FormGroup>
                <FormGroup>
                    <FormControl input='number' placeholder={'amount'} value={this.state.amount} onChange={this.updateAmount}/>
                </FormGroup>
                <div>
                    <Button bsStyle="danger" onClick={this.createTransaction}>Submit</Button>
                </div>
            </div>
        );
    }
}

export default CreateTransaction;