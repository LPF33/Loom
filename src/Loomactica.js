import React, {useState, useEffect} from "react";
import "./Loomactica.css";
import {Link} from "react-router-dom";
import {socket} from "./sockets.js";
import axios from "./axios.js";

export default function(props){

    const serverUrl = window.location.href.startsWith("https://loomchat.herokuapp.com") ? 'https://loomchat.herokuapp.com' : "http://127.0.0.1:8080";

    const [room, setRoom] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState(1);
    const [error, setError] = useState("");
    const [user, setUser] = useState(false);

    useEffect(()=> {
        const param = props.match.params.roomnumber;
        setRoom(param);  
        (async() => {
            const userData = await axios.get(`${serverUrl}/getLoomacticaUser/${param}`);
            setUser(userData.data.user); 
            if(userData.data.user){
                socket.emit("playeronline", param);
            }            
        })();        
    },[props.match]);

    const sendUserData = () => {
        (async() => {
            const checkRoomSize = await axios.get(`${serverUrl}/checkLoomacticaSize/${room}`);
            if(checkRoomSize.data.exceeded){
                setStatus(3);
            } else {
                const check = await axios.post(`${serverUrl}/startLoomactica`, {name,room});
                if(check.data.success){
                    window.location.replace(`/loomactica/${room}`);
                } else {
                    setStatus(2);
                    setError(check.data.error);
                }
            }
                                   
        })(); 
    };

    return(
        <div>
            {!user && 
            <div>        
                <div id="header">LOOM</div> 
                <div id="header2">Connect &amp; Play</div>
                <div id="noChatUser" className="flexColumn">
                    <div>
                        <h1>Play LOOMactica</h1>
                        <h5>Start your game session!</h5>
                    </div>                    
                    {status===1 &&
                        <div className="flexColumn">
                            <input type="text" id="name" name="name" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} onKeyDown={e=> {if(e.key==="Enter"){sendUserData();}}}/> 
                            <input type="submit" value="Play" onClick={sendUserData}></input>
                        </div>
                    }
                    {status===2 &&
                        <div className="flexColumn">
                            <h2>A problem occured</h2>
                            <div className="mailErrorChat">{error}</div>
                            <button type="button" onClick={() => setStatus(1)} className="welcomeButton2">Go back</button>
                        </div>
                    }
                    {status===3 && 
                    <div className="flexColumn">
                        <h4>Sorry!</h4> 
                        <h4>Only 2 Players can play Loomactica!</h4>  
                        <Link to="/" className="noentry">Go to main</Link>
                    </div>                    
                    }                     
                </div>                
            </div>
            }
            {user &&
            <div>
                Classic
            </div>
            }
        </div>
    );
}