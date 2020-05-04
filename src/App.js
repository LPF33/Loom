import React from 'react';
import './App.css';
import {BrowserRouter, Route} from "react-router-dom";
import LoomChat from "./LoomChat.js";

export default function App(){
    return(
        <div id="App"> 
            <BrowserRouter>
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
            </BrowserRouter> 
        </div>

    );
}