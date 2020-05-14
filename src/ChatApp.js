import React, {useState, useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import "./LoomChat.css";
import {socket} from "./sockets.js";


export default function Chat(props){

    const {firstname,lastname} = props.user;
    const {room, chatVisible} = props;

    const [messagedraft, setmessagedraft] = useState("");
    const elemRef = useRef();    

    let messages = useSelector((state) => state.allMessages || []); 

    useEffect(() => {
        if(messages.length>1){
            elemRef.current.scrollTop = 100000;
        }        
    },[messages]);

    function handleClick(){
        if(messagedraft){
            socket.emit("chatMessage", {room, messagedraft,firstname,lastname});
            setmessagedraft("");
        }        
    }

    return(
        <div id="LoomChat" className={chatVisible}>
            <div className="chatOutput" ref={elemRef}>
                {messages && 
                    messages.map((message,index) => 
                        <div className="message" key={index} >
                            <div className="message1">{message.firstname} {message.lastname}</div>
                            <div className="message2">{message.messagedraft}</div>    
                        </div>
                    )}  
            </div>        
            <div className="chatInput">
                <input type="text" 
                    value={messagedraft} 
                    placeholder="Type a message"
                    onChange={e => setmessagedraft(e.target.value)}
                    onKeyDown={e => {
                        if(e.key === "Enter"){
                            handleClick();
                        }
                    }}
                />
                <button onClick={handleClick} className="sendButton">Send</button>
            </div>
        </div>
    );
}