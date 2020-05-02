import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from "./axios.js";

const serverUrl = "localhost:8080";
/*
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reduxPromise from "redux-promise";
import reducer from "./reducers.js";
	
const store = createStore(
	reducer,
	composeWithDevTools(applyMiddleware(reduxPromise))
	);

import {init} from "./sockets.js";
    init(store);*/  
function FriendEmail(props){

    const {email,index, onChange} = props;
        
    return (
        <div className="flex">
            <input type="email" className="friendEmail" name={`friend${index+1}`} placeholder={`Email of ${index+1}.friend`} value={email} onChange={onChange}/>
        </div>
    );
}

function Welcome(){
    let [friendsCount, setFriendsCount] = useState(2);
    let [firstname, setFirstName] = useState("");
    let [lastname, setLastName] = useState("");

    let [emails, setEmails] = useState(["",""]);
    
    
  
    return(        
        <div> 
            <div id="header">LOOM</div>   
            <div id="loomChat">
                <div>
                    <h1>Connect with friends</h1>
                    <div>
                        <input type="text" id="firstname" name="firstname" placeholder="Your firstname" value={firstname} onChange={e => setFirstName(e.target.value)}/> 
                        <input type="text" id="lastname" name="lastname" placeholder="Your lastname" value={lastname} onChange={e => setLastName(e.target.value)}/>   
                    </div>
                    <input type="email" id="email" name="email" placeholder="Your email address" />
                </div>                
                <div>
                    <h1>Invite <button type="button" onClick={() => { if(friendsCount>1){setFriendsCount(--friendsCount); emails.splice(0,1); setEmails(emails);}}} >-</button>{friendsCount}<button type="button" onClick={() => {if(friendsCount<6){setFriendsCount(++friendsCount);setEmails([...emails,""]);} }}>+</button> friends</h1>
                    <h2>Please, insert the email addresses of your friends!</h2>
                    <div id="friendGrid" > {emails.map((email, index) => 
                        <FriendEmail email={email} index={index} key={index} onChange={e => {let em= [...emails]; em[index] = e.target.value; setEmails(em);}}/>
                    )}
                    </div>
                    <input type="submit" value="Invite &amp; Start"></input>
                </div>
                
            </div>   
            <div id="loomBattleship">
                <div>
                    <h1>Canvas</h1>
                </div>
                <div>
                    <h1>Battleship</h1>
                    <h2>Play with a friend</h2>
                </div>
            </div>             
        </div>        
    );
}

const showWelcomePage = (window.location.pathname === '/welcome');

if(showWelcomePage){
    ReactDOM.render(
        <Welcome />,
        document.querySelector("#root")
    );
}else{
    ReactDOM.render(
        <App />,
        document.querySelector("#root")
    );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
