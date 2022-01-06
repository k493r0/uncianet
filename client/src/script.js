import React from "react";
import {render} from "react-dom";
import {Router, Switch, Route} from "react-router-dom";
import history from './history';
import App from "./components/App";
import CreateTransaction from "./components/CreateTransaction";
import Blocks from "./components/Blocks";
import * as ReactDOM from "react-dom";
// import './index.css';

render(
    <Router history={history}>
        <Switch>
            <Route exact path="/" component={App}/>
            <Route path='/blocks' component={Blocks}/>
            <Route path={'/create-transaction'} component={CreateTransaction} />
        </Switch>
    </Router>,
    document.getElementById("root"));

