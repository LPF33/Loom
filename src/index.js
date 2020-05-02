import React, {useState, useRef, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {init} from "./sockets.js";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import loomPlayMoreCanvas from "./loomPlayMoreCanvas";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reduxPromise from "redux-promise";
import reducer from "./reducers.js";	
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

init(store); 

//const serverUrl = "localhost:8080";

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

    const canvasRef = useRef(); 

    useEffect(() => {
        const canvas = canvasRef.current;
        loomPlayMoreCanvas(canvas);
    });
  
    return(        
        <div> 
            <div id="header">LOOM</div>   
            <div id="loomChat">
                <div>
                    <div className="loomChatHeadline">Video &amp; Chat &amp; Whiteboard</div>
                    <h1>Connect with friends</h1>
                    <div>
                        <input type="text" id="firstname" name="firstname" placeholder="Your firstname" value={firstname} onChange={e => setFirstName(e.target.value)}/> 
                        <input type="text" id="lastname" name="lastname" placeholder="Your lastname" value={lastname} onChange={e => setLastName(e.target.value)}/>   
                    </div>
                    <input type="email" id="email" name="email" placeholder="Your email address" />
                </div>                
                <div>
                    <h1>Invite <button className="welcomeButton" type="button" onClick={() => { if(friendsCount>1){setFriendsCount(--friendsCount); emails.splice(0,1); setEmails(emails);}}} >-</button>{friendsCount}<button className="welcomeButton" type="button" onClick={() => {if(friendsCount<6){setFriendsCount(++friendsCount);setEmails([...emails,""]);} }}>+</button> friends</h1>
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
                    Vorschau
                </div>
                <div className="flex">
                    <div>
                        <div className="loomChatHeadline">Loomactica</div>
                        <h1>Battleship</h1>
                        <h2>Play with a friend</h2>                        
                    </div>
                    <div>
                        <h2>Send this link to a friend:</h2>
                        <div className="battleshipLink">www.sowas.de</div>
                        <h2>Or send an email to your friend:</h2>
                        <input type="email" id="battleemail" name="battleemail" placeholder="friends email address" />
                    </div>  
                </div>
            </div>  
            <div id="Registration">
                <div>
                    <canvas id="loomPlayMoreCanvas"
                        ref={canvasRef}
                    ></canvas>
                </div>
                <div>
                    <h1>Registration</h1>
                    <h2>Play more games with friends</h2> 
                </div>
            </div>            
        </div>        
    );
}

const showWelcomePage = (window.location.pathname === '/welcome');

if(showWelcomePage){
    ReactDOM.render(
        <Provider store={store}>
            <Welcome />
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
