import React from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import LoomChat from "./LoomChat.js";

export default function App(){
    return(
        <div> 
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