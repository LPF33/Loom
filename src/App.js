import React from 'react';
import './App.css';
import {BrowserRouter, Route} from "react-router-dom";
import Registration from "./Registration.js";

export default function App(){
    return(
        <div> 
            <BrowserRouter>
                <Route 
                    exact path = "/registration"
                    component={Registration}
                /> 
            </BrowserRouter> 
        </div>

    );
}