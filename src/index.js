import React, {useState, useEffect} from 'react';
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
import axios from "./axios.js";	
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

init(store); 

const serverUrl = "http://127.0.0.1:8080";
const mainUrl = "http://127.0.0.1:3000";

function FriendEmail(props){

    let {email,index, onChange} = props;
        
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
    let [mainEmail, setMainEmail] = useState("");
    let [friendEmail, setFriendEmail] = useState("");

    let [emails, setEmails] = useState(["",""]); 
    let [link1, setLink1] = useState("");
    let [link2, setLink2] = useState("");
    let [code, setCode] = useState(["",""]);

    let [statusChat,setStatusChat] = useState(1);
    let [error, setError] = useState("");

    let [statusBattleship,setStatusBattleship] = useState(1);
    let [error2, setError2] = useState("");
    
    useEffect(() => {
        (async() => {
            const code = await axios.get(`${serverUrl}/randomCode`);
            const code2 = await axios.get(`${serverUrl}/randomCode`); 
            setLink1(`${mainUrl}/loomchat/${code.data.secretCode}`);
            setLink2(`${mainUrl}/loomactica/${code2.data.secretCode}`);
            setCode([code.data.secretCode,code2.data.secretCode]);
        })();
    }, []);

    const sendChatMail = async () => {
        const send = await axios.post(`${serverUrl}/invitationChat`, {firstname, lastname, mainEmail, emails, link1});
        if(send.data.success){
            setStatusChat(2);
        } else {
            if(send.data.empty){
                setStatusChat(4);
            } else {
                setError(send.data.error);
                setStatusChat(3);
            }            
        }
    };

    const sendBattleshipMail = async () => {
        const send = await axios.post(`${serverUrl}/invitationBattleship`, {firstname, mainEmail, friendEmail, link2});
        if(send.data.success){
            setStatusBattleship(2);
        } else {
            if(send.data.empty){
                setStatusBattleship(4);
            } else {
                setError2(send.data.error);
                setStatusBattleship(3);
            }            
        }
    };

    const changeRouting = async() => {
        await axios.post(`${serverUrl}/startLoomChat`, {firstname,lastname,room:code[0]});
        window.location.replace(`/loomChat/${code[0]}`);
    };
    const changeRoutingPlay = async() => {
        await axios.post(`${serverUrl}/startLoomactica`, {firstname,lastname,room:code[1]});
        window.location.replace(`/loomactica/${code[1]}`);
    };
  
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
                    <input type="email" id="email" name="email" placeholder="Your email address"  value={mainEmail} onChange={e => setMainEmail(e.target.value)}/>
                </div>  
                {statusChat===1 &&             
                <div>
                    {statusChat!==2 &&
                    <div className="flex">
                        <h2>Send this link to your friends:</h2>
                        <div className="battleshipLink">{link1}</div>                        
                        <button className="welcomeButton2" type="button" onClick={changeRouting}>Start</button>
                    </div>  
                    }                  
                    <h1>OR Invite <button className="welcomeButton" type="button" onClick={() => { if(friendsCount>1){setFriendsCount(--friendsCount); emails.splice(0,1); setEmails(emails);}}} >-</button>{friendsCount}<button className="welcomeButton" type="button" onClick={() => {if(friendsCount<6){setFriendsCount(++friendsCount);setEmails([...emails,""]);} }}>+</button> friends</h1>
                    <h2>Please, insert the email addresses of your friends!</h2>
                    <div id="friendGrid" > {emails.map((email, index) => 
                        <FriendEmail email={email} index={index} key={index} onChange={e => {let em= [...emails]; em[index] = e.target.value; setEmails(em);}}/>
                    )}
                    </div>
                    <input type="submit" value="Invite" onClick={sendChatMail}></input>
                </div>
                } 
                {statusChat===2 &&
                <div>
                    <h1>All invitations were sent successfully!</h1>
                    <h2>You can now enter the chat room!</h2>
                    <button className="welcomeButton2" type="button" onClick={changeRouting}>Start</button>
                </div>
                }
                {statusChat===3 &&
                <div>
                    <h1>A problem occured</h1>
                    <div className="mailError">{error}</div>
                    <button type="button" onClick={()=> setStatusChat(1)} className="welcomeButton2">Go back</button>
                </div>
                }
                {statusChat===4 &&
                <div>
                    <h1>Please fill out all fields!</h1>
                    <h2>Please go back and try again!</h2>
                    <button type="button" onClick={()=> setStatusChat(1)} className="welcomeButton2">Go back</button>
                </div>
                }
            </div>   
            <div id="loomBattleship">
                <div>
                    Vorschau
                </div>
                <div className="flex">
                    <div>
                        <div className="loomChatHeadline">Battleship</div>
                        <h1>Loomactica</h1>      
                        <input type="text" id="firstname2" name="firstname2" placeholder="Your firstname" value={firstname} onChange={e => setFirstName(e.target.value)}/>                  
                        <input type="email" id="email2" name="email2" placeholder="Your email address"  value={mainEmail} onChange={e => setMainEmail(e.target.value)}/>
                    </div>
                    <div >
                        {statusBattleship !== 2 &&
                        <div className="flex battleshipside" >
                            <div>
                                <h2>Play with a friend and send this link to a friend:</h2>
                                <div className="battleshipLink">{link2}</div>
                            </div>
                            <button className="welcomeButton2" type="button" onClick={changeRoutingPlay}>Play</button>
                        </div>
                        }
                        {statusBattleship===1 &&
                        <div className="flex battleshipside" >                                
                            <div>
                                <h2>Or send an email to your friend:</h2>
                                <input type="email" id="battleemail" name="battleemail" placeholder="friends email address" value={friendEmail} onChange={e => setFriendEmail(e.target.value)}/>
                            </div>
                            <input type="submit" value="Send" onClick={sendBattleshipMail}></input>                                
                        </div> 
                        }      
                        {statusBattleship===2 &&
                            <div className="flex battleshipside">
                                <div>
                                    <h1>The inviation was sent successfully!</h1>
                                    <h2>You can now go and start the battle!</h2>
                                </div>                                    
                                <button className="welcomeButton2" type="button" onClick={changeRoutingPlay}>Play</button>
                            </div>
                        }   
                        {statusBattleship===3 &&
                        <div className="flex battleshipside">
                            <div>
                                <h1>A problem occured</h1>
                                <div className="mailError">{error2}</div>
                            </div>                                
                            <button type="button" onClick={()=> setStatusBattleship(1)} className="welcomeButton2">Go back</button>
                        </div>
                        }
                        {statusBattleship===4 &&
                        <div className="flex battleshipside">
                            <div>
                                <h1>Please fill out all fields!</h1>
                                <h2>Please go back and try again!</h2>
                            </div>                                
                            <button type="button" onClick={()=> setStatusBattleship(1)} className="welcomeButton2">Go back</button>
                        </div>
                        }
                    </div>  
                </div>
            </div>  
            <div id="end">
                <div>This is not the END</div>
                <h2>Coming more next</h2>
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
