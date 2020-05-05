import React from 'react';
import ReactDOM from 'react-dom';
import {init} from "./sockets.js";
import './index.css';
import WelcomePage from "./WelcomePage";
import App from './App';
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

const showWelcomePage = (window.location.pathname === '/');

if(showWelcomePage){
    ReactDOM.render(
        <Provider store={store}>
            <WelcomePage />
        </Provider>,
        document.querySelector("#root")
    );
}else{
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.querySelector("#root")
    );
}
