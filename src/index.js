import React from 'react';
import ReactDOM from 'react-dom';
import {init} from "./sockets.js";
import './index.css';
import WelcomePage from "./WelcomePage";
import {BrowserRouter, Route, Redirect, Switch} from "react-router-dom";
import LoomChat from "./LoomChat.js";
import Loomactica from "./Loomactica.js";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reduxPromise from "redux-promise";
import reducer from "./reducers.js";
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise)),
);

init(store); 


ReactDOM.render(
    <Provider store={store}>
        
        <BrowserRouter>
            <Switch> 
                <Route
                    exact path = "/"
                    component={WelcomePage}
                />                
                <Route
                    exact path = "/loomChat/:roomnumber"
                    render={props => (
                        <LoomChat
                            key={props.match.url}
                            match={props.match}
                            history={props.history}
                        />
                    )}
                />
                <Route
                    exact path = "/loomactica/:roomnumber"
                    render={props => (
                        <Loomactica
                            key={props.match.url}
                            match={props.match}
                            history={props.history}
                        />
                    )}
                />
                <Route 
                    render={
                        ()=>
                            <Redirect to="/" />
                        
                    }
                />
            </Switch>
        </BrowserRouter> 
    </Provider>,
    document.querySelector("#root")
);



