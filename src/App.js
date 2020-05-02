import React from 'react';
import './App.css';
import {BrowserRouter, Route} from "react-router-dom";
import Registration from "./Registration.js";
import LoomChat from "./LoomChat.js";

export default function App(){
    return(
        <div id="App"> 
            <BrowserRouter>
                <Route 
                    exact path = "/registration"
                    component={Registration}
                /> 
                <Route
                    path = "/loomChat"
                    component={LoomChat}
                />
            </BrowserRouter> 
        </div>

    );
}