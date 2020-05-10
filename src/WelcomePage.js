import React, {useState, useEffect} from 'react';
import './index.css';
import axios from "./axios.js";	
import {Link} from "react-router-dom";

const serverUrl = window.location.href.startsWith("https://loomchat.herokuapp.com") ? 'https://loomchat.herokuapp.com' : "http://127.0.0.1:8080";
const mainUrl = window.location.href.startsWith("https://loomchat.herokuapp.com") ? 'https://loomchat.herokuapp.com' : "http://127.0.0.1:3000";

function FriendEmail(props){

    let {email,index, onChange} = props;
        
    return (
        <div className="flex">
            <input type="email" className="friendEmail" name={`friend${index+1}`} placeholder={`Email of ${index+1}.friend`} value={email} onChange={onChange}/>
        </div>
    );
}

export default function Welcome(){
    let [friendsCount, setFriendsCount] = useState(2);
    let [topic, setTopic] = useState("");
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
        const send = await axios.post(`${serverUrl}/invitationChat`, {topic, mainEmail, emails, link1});
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
        const send = await axios.post(`${serverUrl}/invitationBattleship`, {topic, mainEmail, friendEmail, link2});
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
  
    return(        
        <div>                    
            <div id="header">LOOM</div>   
            <div id="header2">Connect &amp; Chat</div>


            <div id="loomChatStart">
                <div className="flexColumn">
                    <div className="loomChatHeadline">Video &amp; Chat &amp; Whiteboard</div>
                    <h1>Connect with friends</h1>
                    <h2>Start right away, copy this link and send it to friends!</h2>
                    <div className="battleshipLink">{link1}</div> 
                    <Link to={`/loomChat/${code[0]}`} className="welcomeButton2" >Start</Link>
                </div>
            </div>  
            <div id="loomChatInvitation">
                {statusChat===1 &&             
                <div>      
                    <h1>Send inviations!</h1> 
                    <h2>Invite your friends!</h2>              
                    <h1>Invite <button className="welcomeButton" type="button" onClick={() => { if(friendsCount>1){setFriendsCount(--friendsCount); emails.splice(0,1); setEmails(emails);}}} >-</button>{friendsCount}<button className="welcomeButton" type="button" onClick={() => {if(friendsCount<6){setFriendsCount(++friendsCount);setEmails([...emails,""]);} }}>+</button> friends</h1>
                    <h2>Topic of your LOOM session:</h2>
                    <input type="text" id="topic" name="topic" value={topic} onChange={e => setTopic(e.target.value)}/> 
                    <h2>Your email:</h2>
                    <input type="email" id="mainemail" name="email" value={mainEmail} onChange={e => setMainEmail(e.target.value)}/>
                </div>
                } 
                {statusChat===2 &&
                <div className="flexColumn">
                    <h1>All invitations were sent successfully!</h1>
                    <h2>You can now enter the chat room!</h2>
                    <Link to={`/loomChat/${code[0]}`} className="welcomeButton2 inviteLink" >Start</Link>
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
            {statusChat===1 &&
            <div id="loomChatFriends">
                <h2>Your friends email:</h2>
                <div> {emails.map((email, index) => 
                    <FriendEmail email={email} index={index} key={index} onChange={e => {let em= [...emails]; em[index] = e.target.value; setEmails(em);}}/>
                )}
                <input type="submit" value="Invite" onClick={sendChatMail}></input>
                </div> 
            </div> 
            }
            <div id="loomBattleshipPreview">
                Vorschau
            </div>
            <div id="loomBattleship">
                <div className="flexColumn">
                    <div className="loomChatHeadline">LOOMactica Battleship</div>
                    <h1>Play this classic game!</h1>
                    <h2>Copy &amp; send this link to a friend:</h2>
                    <div className="battleshipLink">{link2}</div>
                    <Link to={`/loomactica/${code[1]}`} className="welcomeButton2" >Play</Link>
                </div>
            </div>
            <div id="loomBattleshipInvitation">
                <div>
                    {statusBattleship===1 &&
                    <div className="flexColumn" >   
                        <h1>Invite your friend!</h1>                         
                        <h2>Send a message:</h2>
                        <input type="text"  name="topic" value={topic} onChange={e => setTopic(e.target.value)}/> 
                        <h2>Your and your friends email:</h2>
                        <input type="email"  name="email" value={mainEmail} placeholder="your email address" onChange={e => setMainEmail(e.target.value)}/>
                        <input type="email" id="battleemail" name="battleemail" placeholder="friends email address" value={friendEmail} onChange={e => setFriendEmail(e.target.value)}/>
                        <input type="submit" value="Send" onClick={sendBattleshipMail}></input>                                
                    </div> 
                    }      
                    {statusBattleship===2 &&
                        <div className="flexColumn">
                            <h1>The inviation was sent successfully!</h1>
                            <h2>You can now start the battle!</h2>                               
                            <Link to={`/loomactica/${code[1]}`} className="welcomeButton2" >Play</Link>
                        </div>
                    }   
                    {statusBattleship===3 &&
                    <div className="flexColumn">
                        <h1>A problem occured</h1>
                        <div className="mailError">{error2}</div>                            
                        <button type="button" onClick={()=> setStatusBattleship(1)} className="welcomeButton2">Go back</button>
                    </div>
                    }
                    {statusBattleship===4 &&
                    <div className="flexColumn">
                        <h1 className="flex" >Please fill out all fields!</h1>
                        <h2>Please go back and try again!</h2>                         
                        <button type="button" onClick={()=> setStatusBattleship(1)} className="welcomeButton2">Go back</button>
                    </div>
                    }
                </div>  
            </div> 
            <div id="end">
                <div>THE END</div>
            </div>             
        </div>        
    );
}